<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  h,
  resolveComponent,
  watch,
  onMounted,
} from "vue";
import { useI18n } from "#imports";
import {
  useDepartmentService,
  type Department,
  type DepartmentCreateParams,
  type DepartmentUpdateParams,
} from "~/composables/api/services/departmentService";

const { t, locale } = useI18n();
const UButton = resolveComponent("UButton");

/** ================== 状态 ================== */
const deptService = useDepartmentService();

const tree = ref<Department[]>([]); // 后端返回的树
const flat = ref<Department[]>([]); // 扁平化，用于选择上级部门等
const isLoadingTree = ref(false);
const loadError = ref<string | null>(null);

const activeNodeId = ref<number | null>(null); // UTree 当前选中部门 id
const activeNode = computed(
  () => flat.value.find((d) => d.id === activeNodeId.value) || null
);

const searchQuery = ref("");

/** 分页 */
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
});
const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

/** 表单 & 弹窗 */
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const departmentForm = reactive<
  DepartmentCreateParams & Required<Pick<DepartmentCreateParams, "name">>
>({
  name: "",
  parent_id: undefined,
});

const resetForm = () => {
  departmentForm.name = "";
  departmentForm.parent_id = activeNodeId.value ?? undefined; // 默认选中节点为上级
  isEditing.value = false;
  editingId.value = null;
};

const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

const openEditForm = (dept: Department) => {
  departmentForm.name = dept.name;
  departmentForm.parent_id = dept.parent_id;
  isEditing.value = true;
  editingId.value = dept.id;
  showForm.value = true;
};

/** ================== 数据获取 & 工具 ================== */
const fetchTree = async () => {
  isLoadingTree.value = true;
  loadError.value = null;
  try {
    const data = await deptService.getDepartmentTree();
    tree.value = data;
    flat.value = flattenDepartments(data);

    // 默认选择第一个根节点
    if (!activeNodeId.value) {
      const firstRoot = flat.value.find((d) => !d.parent_id);
      activeNodeId.value = firstRoot?.id ?? null;
    }
    selectedValue.value = activeNodeId.value
      ? [String(activeNodeId.value)]
      : [];
  } catch (e: any) {
    loadError.value = e?.message ?? "加载失败";
  } finally {
    isLoadingTree.value = false;
  }
};

/** UTree 数据 */
const treeItems = computed(() => tree.value.map((n) => toTreeItem(n)));

function toTreeItem(n: Department): any {
  const hasChildren = !!(n.children && n.children.length);
  return {
    // ✅ UTree 用 value 作为唯一标识（或 label）
    value: String(n.id),
    label: n.name,
    id: n.id, // 额外带上，方便右侧编辑删除
    hasChildren,
    children: hasChildren ? n.children!.map(toTreeItem) : undefined,
  };
}

const activeNodeActivePath = ref<string[]>([]);

// 当树数据加载完，初始化一次（保持和 activeNodeId 同步）
watch(
  () => activeNodeId.value,
  (id) => {
    activeNodeActivePath.value = id ? [String(id)] : [];
  },
  { immediate: true }
);

// 新增：选中值 & 展开集合（字符串数组）
const selectedValue = ref<string[]>([]);
const expandedValues = ref<string[]>([]);

// 同步：当选择变化时，更新 activeNodeId（右侧列表依赖它）
watch(selectedValue, (vals) => {
  const first = Array.isArray(vals) && vals.length ? vals[0] : null;
  activeNodeId.value = first ? Number(first) : null;
  pagination.page = 1;
});

onMounted(fetchTree);

function flattenDepartments(nodes: Department[], result: Department[] = []) {
  for (const n of nodes) {
    result.push(n);
    if (n.children?.length) flattenDepartments(n.children, result);
  }
  return result;
}

/** 右侧表格：显示当前选中节点的“直接子部门”，并支持搜索+分页 */
const childrenOfActive = computed<Department[]>(() => {
  if (!activeNodeId.value) return [];
  const parent = flat.value.find((d) => d.id === activeNodeId.value);
  return parent?.children ?? [];
});

const filteredDepartments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const list = childrenOfActive.value;
  return q
    ? list.filter((d) => (d.name ?? "").toLowerCase().includes(q))
    : list;
});

watch(
  [filteredDepartments, () => pagination.pageSize],
  () => {
    pagination.total = filteredDepartments.value.length;
    pagination.totalPages = Math.ceil(pagination.total / pagination.pageSize);
    if (pagination.page > pagination.totalPages)
      pagination.page = pagination.totalPages || 1;
  },
  { immediate: true }
);

const paginatedDepartments = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize;
  return filteredDepartments.value.slice(start, start + pagination.pageSize);
});

const paginationInfo = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize + 1;
  const end = Math.min(pagination.page * pagination.pageSize, pagination.total);
  return {
    start: pagination.total > 0 ? start : 0,
    end,
    total: pagination.total,
    page: pagination.page,
    totalPages: pagination.totalPages,
  };
});

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.totalPages) pagination.page = page;
};
const changePageSize = (v: number | string) => {
  pagination.pageSize = Number(v);
  pagination.page = 1;
};
const hasNextPage = computed(() => pagination.page < pagination.totalPages);
const hasPrevPage = computed(() => pagination.page > 1);

/** 选择上级部门（下拉用） */
const parentOptions = computed(() => {
  const selfId = editingId.value;
  return [
    {
      label: t("organization.department.form.noParent") as string,
      value: null as any,
    },
    ...flat.value
      .filter((d) => d.id !== selfId) // 🚫 不能把自己选为上级
      .map((d) => ({ label: d.name, value: d.id })),
  ];
});

/** ================== CRUD（走后端） ================== */
const saveDepartment = async () => {
  if (isEditing.value && editingId.value) {
    const ok = await deptService.updateDepartment(editingId.value, {
      name: departmentForm.name,
      parent_id: departmentForm.parent_id,
    } as DepartmentUpdateParams);
    if (!ok) return;
  } else {
    const created = await deptService.createDepartment({
      name: departmentForm.name,
      parent_id: departmentForm.parent_id,
    } as DepartmentCreateParams);
    if (!created) return;
  }
  showForm.value = false;
  await fetchTree();
  resetForm();
};

const deleteDepartment = async (id: number) => {
  if (!confirm(t("organization.department.confirmDelete") as string)) return;
  const ok = await deptService.deleteDepartment(id);
  if (ok) {
    // 若删除的是当前选中节点，则切回父级或任一根
    if (activeNodeId.value === id) {
      const deleted = flat.value.find((d) => d.id === id);
      activeNodeId.value =
        deleted?.parent_id ?? flat.value.find((d) => !d.parent_id)?.id ?? null;
    }
    await fetchTree();
  }
};

/** ============ TanStack 列定义（右侧“子部门列表”） ============ */
const columns = computed(() => {
  const _ = locale.value; // 语言切换依赖
  return [
    {
      id: "name",
      accessorKey: "name",
      header: t("organization.department.table.name"),
      cell: ({ row }: any) => {
        const d: Department = row.original;
        // 高亮当前选择的节点的直接子项名称
        return h("div", { class: "flex items-center gap-2" }, [
          h("span", d.name),
        ]);
      },
    },
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
    },
    {
      id: "parent",
      header: t("organization.department.form.parent") || "上级部门",
      cell: ({ row }: any) => {
        const d: Department = row.original;
        const parentName = d.parent_id
          ? (flat.value.find((x) => x.id === d.parent_id)?.name ?? "-")
          : "-";
        return h("span", parentName);
      },
    },
    {
      id: "actions",
      header: t("organization.department.table.actions"),
      enableSorting: false,
      cell: ({ row }: any) => {
        const d: Department = row.original;
        return h("div", { class: "flex gap-2" }, [
          h(
            UButton,
            {
              size: "xs",
              variant: "ghost",
              icon: "i-heroicons-pencil-square",
              onClick: () => openEditForm(d),
            },
            { default: () => t("organization.common.edit") }
          ),
          h(
            UButton,
            {
              size: "xs",
              color: "error",
              variant: "ghost",
              icon: "i-heroicons-trash",
              onClick: () => deleteDepartment(d.id),
            },
            { default: () => t("organization.common.delete") }
          ),
        ]);
      },
    },
  ];
});

/** UTree 选择 */
function onSelectNode(payload: any) {
  // 统一把各种形态归一到 string[]
  let arr: string[] = [];

  if (Array.isArray(payload)) {
    arr = payload.map(String);
  } else if (payload && typeof payload === "object") {
    if ("id" in payload) arr = [String((payload as any).id)];
    else if ("value" in payload) arr = [String((payload as any).value)];
  } else if (payload != null) {
    arr = [String(payload)];
  }

  selectedValue.value = arr;
  activeNodeId.value = arr.length ? Number(arr[0]) : null;
  activeNodeActivePath.value = selectedValue.value.slice(0, 1);
  pagination.page = 1;
}
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">
          {{ $t("organization.department.title") }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ $t("organization.department.description") }}
        </p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus" @click="openAddForm">
        {{ $t("organization.department.add") }}
      </UButton>
    </div>

    <!-- 搜索 -->
    <UInput
      v-model="searchQuery"
      icon="i-heroicons-magnifying-glass"
      :placeholder="$t('organization.department.search')"
      class="w-full md:w-80 mb-4"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- 左侧：组织树 -->
      <UCard class="col-span-1">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">
              {{ $t("organization.department.title") }}
            </h3>
            <UButton
              icon="i-heroicons-plus-circle"
              size="sm"
              color="gray"
              variant="ghost"
              @click="openAddForm"
            >
              {{ $t("organization.department.add") }}
            </UButton>
          </div>
        </template>

        <div v-if="isLoadingTree" class="flex justify-center py-4">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6" />
        </div>
        <div v-else-if="loadError" class="text-center text-red-500 py-4">
          {{ loadError }}
        </div>
        <div
          v-else-if="treeItems.length === 0"
          class="text-center py-4 text-gray-500"
        >
          {{ $t("organization.department.empty.title") }}
        </div>
        <div v-else class="department-tree">
          <UTree
            :items="treeItems"
            v-model="selectedValue"
            v-model:expanded="expandedValues"
            expanded-icon="i-heroicons-folder-open"
            collapsed-icon="i-heroicons-folder"
            @update:model-value="onSelectNode"
          >
            <!-- 左侧图标：三态明确区分 -->
            <template #item-leading="{ item, expanded }">
              <UIcon
                :name="
                  item.hasChildren
                    ? expanded
                      ? 'i-heroicons-folder-open'
                      : 'i-heroicons-folder'
                    : 'i-heroicons-document'
                "
                :class="[
                  'h-4 w-4',
                  item.hasChildren ? 'text-amber-500' : 'text-gray-400',
                ]"
              />
            </template>

            <template #item-label="{ item }">
              <span>{{ item.label }}</span>
            </template>

            <template #item-trailing="{ item }">
              <div class="flex space-x-1">
                <UButton
                  icon="i-heroicons-pencil"
                  size="xs"
                  color="gray"
                  variant="ghost"
                  @click.stop="
                    openEditForm({
                      id: Number(item.id),
                      name: item.label,
                      parent_id: flat.find((x) => x.id === Number(item.id))
                        ?.parent_id,
                    } as any)
                  "
                />
                <UButton
                  icon="i-heroicons-trash"
                  size="xs"
                  color="red"
                  variant="ghost"
                  @click.stop="deleteDepartment(Number(item.id))"
                />
              </div>
            </template>
          </UTree>
        </div>
      </UCard>

      <!-- 右侧：选中节点的直接子部门列表（表格） -->
      <UCard class="col-span-1 md:col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">
              {{
                activeNode
                  ? `${activeNode.name} - ${$t("organization.department.title")}`
                  : $t("organization.department.title")
              }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">{{
                $t("organization.department.table.name")
              }}</span>
            </div>
          </div>
        </template>

        <div class="bg-white rounded-lg">
          <UTable
            :data="paginatedDepartments"
            :columns="columns"
            :row-key="(row) => row.id"
          />

          <div
            v-if="pagination.totalPages > 1"
            class="px-6 py-4 border-t border-gray-200"
          >
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">
                第 {{ pagination.page }} /
                {{ pagination.totalPages }} 页；本级子部门
                {{ pagination.total }} 个
              </div>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">每页：</span>
                  <USelect
                    :model-value="pagination.pageSize"
                    :items="pageSizeOptions"
                    option-attribute="label"
                    value-attribute="value"
                    @update:model-value="changePageSize"
                    class="w-20"
                  />
                </div>
                <div class="flex gap-2">
                  <UButton
                    :disabled="!hasPrevPage"
                    variant="outline"
                    size="sm"
                    icon="i-heroicons-chevron-left"
                    @click="changePage(pagination.page - 1)"
                    >上一页</UButton
                  >
                  <UButton
                    :disabled="!hasNextPage"
                    variant="outline"
                    size="sm"
                    icon="i-heroicons-chevron-right"
                    @click="changePage(pagination.page + 1)"
                    >下一页</UButton
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span
              >显示第 {{ paginationInfo.start }} -
              {{ paginationInfo.end }} 条，共
              {{ paginationInfo.total }} 条</span
            >
          </div>
        </template>
      </UCard>
    </div>

    <!-- 空状态（针对右侧列表） -->
    <div
      v-if="!isLoadingTree && filteredDepartments.length === 0"
      class="text-center py-10 text-gray-500"
    >
      {{ $t("organization.department.empty.noResults") }}
    </div>

    <!-- 表单 -->
    <UModal v-model:open="showForm" :ui="{ content: 'sm:max-w-md' }">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-medium text-gray-900">
              {{
                isEditing
                  ? $t("organization.department.edit")
                  : $t("organization.department.add")
              }}
            </h3>
          </template>

          <form @submit.prevent="saveDepartment">
            <div class="space-y-4">
              <UFormField
                :label="$t('organization.department.form.name')"
                required
              >
                <UInput
                  v-model="departmentForm.name"
                  :placeholder="
                    $t('organization.department.form.namePlaceholder')
                  "
                />
              </UFormField>

              <UFormField :label="$t('organization.department.form.parent')">
                <USelect
                  :model-value="departmentForm.parent_id"
                  :items="parentOptions"
                  option-attribute="label"
                  value-attribute="value"
                  :placeholder="$t('organization.department.form.noParent')"
                  @update:model-value="
                    (v) =>
                      (departmentForm.parent_id =
                        v === undefined || v === null || v === ''
                          ? undefined
                          : Number(v))
                  "
                />
              </UFormField>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <UButton
                color="neutral"
                variant="outline"
                @click="showForm = false"
              >
                {{ $t("organization.common.cancel") }}
              </UButton>
              <UButton type="submit" color="primary">
                {{ $t("organization.common.save") }}
              </UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<style>
.department-tree :deep(.u-tree-node) {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.department-tree :deep(.u-tree-node-content) {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}
.department-tree :deep(.u-tree-node-content:hover) {
  background-color: #f3f4f6;
}
.dark .department-tree :deep(.u-tree-node-content:hover) {
  background-color: #1f2937;
}
.department-tree :deep(.u-tree-node-selected) {
  background-color: rgba(var(--color-primary-500), 0.1);
}
.dark .department-tree :deep(.u-tree-node-selected) {
  background-color: rgba(var(--color-primary-500), 0.05);
}
</style>
