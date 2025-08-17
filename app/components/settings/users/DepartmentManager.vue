<script setup lang="ts">
import { ref, reactive, computed, h, resolveComponent } from "vue";
import { useI18n } from "#imports";

const { t, locale } = useI18n();

type Department = {
  id: number;
  name: string;
  code: string;
  leader: string;
  memberCount: number;
  description: string;
};

const departments = ref<Department[]>([
  {
    id: 1,
    name: "技术部",
    code: "tech",
    leader: "张三",
    memberCount: 12,
    description: "负责产品研发和技术支持",
  },
  {
    id: 2,
    name: "市场部",
    code: "marketing",
    leader: "李四",
    memberCount: 8,
    description: "负责市场推广和品牌建设",
  },
  {
    id: 3,
    name: "销售部",
    code: "sales",
    leader: "王五",
    memberCount: 15,
    description: "负责产品销售和客户关系",
  },
  {
    id: 4,
    name: "人力资源部",
    code: "hr",
    leader: "赵六",
    memberCount: 5,
    description: "负责人员招聘和培训",
  },
  {
    id: 5,
    name: "财务部",
    code: "finance",
    leader: "钱七",
    memberCount: 6,
    description: "负责财务管理和预算控制",
  },
]);

const searchQuery = ref("");

// 表单与弹窗
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const departmentForm = reactive({
  name: "",
  code: "",
  leader: "",
  description: "",
});

const resetForm = () => {
  departmentForm.name = "";
  departmentForm.code = "";
  departmentForm.leader = "";
  departmentForm.description = "";
  isEditing.value = false;
  editingId.value = null;
};

const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

const openEditForm = (dept: Department) => {
  departmentForm.name = dept.name;
  departmentForm.code = dept.code;
  departmentForm.leader = dept.leader;
  departmentForm.description = dept.description;
  isEditing.value = true;
  editingId.value = dept.id;
  showForm.value = true;
};

const saveDepartment = () => {
  if (isEditing.value) {
    const index = departments.value.findIndex((d) => d.id === editingId.value);
    if (index !== -1) {
      departments.value[index] = {
        ...departments.value[index],
        ...departmentForm,
      };
    }
  } else {
    const newId = Math.max(0, ...departments.value.map((d) => d.id)) + 1;
    departments.value.push({
      id: newId,
      memberCount: 0,
      ...departmentForm,
    } as Department);
  }
  showForm.value = false;
  resetForm();
};

const deleteDepartment = (id: number) => {
  if (confirm("确定要删除此部门吗？")) {
    departments.value = departments.value.filter((d) => d.id !== id);
  }
};

const filteredDepartments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return departments.value;
  return departments.value.filter(
    (dept) =>
      (dept.name ?? "").toLowerCase().includes(q) ||
      (dept.code ?? "").toLowerCase().includes(q) ||
      (dept.leader ?? "").toLowerCase().includes(q) ||
      (dept.description ?? "").toLowerCase().includes(q)
  );
});

// ====== ✅ Nuxt UI 3.3+：TanStack 列定义 ======
const UButton = resolveComponent("UButton");

const columns = computed(() => {
  const _ = locale.value; // 显式依赖，切换语言时重算
  return [
    {
      id: "name",
      accessorKey: "name",
      header: t("organization.department.table.name").toString(),
    },
    {
      id: "code",
      accessorKey: "code",
      header: t("organization.department.table.code").toString(),
    },
    {
      id: "leader",
      accessorKey: "leader",
      header: t("organization.department.table.leader").toString(),
    },
    {
      id: "memberCount",
      accessorKey: "memberCount",
      header: t("organization.department.table.memberCount").toString(),
    },
    {
      id: "description",
      accessorKey: "description",
      header: t("organization.department.table.description").toString(),
    },
    {
      id: "actions",
      header: t("organization.department.table.actions").toString(), // 这里是字符串，但我们仍提供 id 以防后续自定义成 VNode
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
            { default: () => t("organization.common.edit").toString() }
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
            { default: () => t("organization.common.delete").toString() }
          ),
        ]);
      },
    },
  ];
});
</script>

<template>
  <div>
    <!-- 搜索 -->
    <UInput
      v-model="searchQuery"
      icon="i-heroicons-magnifying-glass"
      :placeholder="$t('organization.department.search')"
      class="w-full md:w-80 mb-6"
    />

    <!-- ✅ Nuxt UI 3.3+ 用 :data 和 TanStack columns -->
    <UTable :data="filteredDepartments" :columns="columns" />

    <!-- 空状态 -->
    <div
      v-if="filteredDepartments.length === 0"
      class="text-center py-12 bg-gray-50 rounded-lg mt-4"
    >
      <UIcon
        name="i-heroicons-building-office"
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ $t("organization.department.empty.title") }}
      </h3>
      <p class="text-gray-500 mb-4">
        {{
          searchQuery
            ? $t("organization.department.empty.noResults")
            : $t("organization.department.empty.create")
        }}
      </p>
      <UButton v-if="!searchQuery" color="primary" @click="openAddForm">
        {{ $t("organization.department.add") }}
      </UButton>
    </div>

    <!-- 表单 -->
    <UModal v-model:open="showForm" :ui="{ content: 'sm:max-w-md' }">
      <template #content>
        <!-- 保持你原来的表单结构 -->
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

              <UFormField
                :label="$t('organization.department.form.code')"
                required
              >
                <UInput
                  v-model="departmentForm.code"
                  :placeholder="
                    $t('organization.department.form.codePlaceholder')
                  "
                />
              </UFormField>

              <UFormField :label="$t('organization.department.form.leader')">
                <UInput
                  v-model="departmentForm.leader"
                  :placeholder="
                    $t('organization.department.form.leaderPlaceholder')
                  "
                />
              </UFormField>

              <UFormField
                :label="$t('organization.department.form.description')"
              >
                <UTextarea
                  v-model="departmentForm.description"
                  :placeholder="
                    $t('organization.department.form.descriptionPlaceholder')
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
