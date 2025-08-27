<!-- /components/settings/users/PermissionRoot.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "~/stores/permission";
import { useUserStore } from "~/stores/user";

import type { FormError, FormSubmitEvent } from "@nuxt/ui"; // 类型辅助（可选）

// 权限 Store
const permissionStore = usePermissionStore();
const { permissions, isLoading, error } = storeToRefs(permissionStore);

// 用户 Store
const userStore = useUserStore();

// 选项：从已有权限里聚合分类 + “自定义…”
const categoryOptions = computed(() => {
  const base = Array.from(
    new Set((permissions.value || []).map((p) => p?.category).filter(Boolean))
  ).map((c) => ({ label: c as string, value: c as string }));
  return [...base, { label: "（自定义…）", value: "__custom__" }];
});

// code 格式建议：module.action 或 module:action
const codePattern =
  /^[a-z][a-z0-9._:-]*\.[a-z][a-z0-9._:-]*$|^[a-z][a-z0-9._:-]*:[a-z][a-z0-9._:-]*$/;

const isCodeUnique = (code: string, ignoreId?: string) => {
  const list = permissions.value || [];
  const target = (code || "").trim().toLowerCase();
  return !list.some(
    (p) => p?.code?.toLowerCase() === target && p?.id !== ignoreId
  );
};

/** -------- 新增表单 state -------- */
const newPermissionForm = ref({
  name: "",
  code: "",
  description: "",
  category: null,
  customCategory: null,
  enabled: true,
  scope: "system", // system | tenant
  riskLevel: "low", // low | medium | high
  sort: 100,
  tagsInput: "", // 逗号分隔输入，提交时再拆分
});

/** -------- 编辑表单 state -------- */
const editingForm = ref<Permission | null>({
  name: "",
  code: "",
  description: "",
  category: null,
  customCategory: null,
  enabled: true,
  scope: "system", // system | tenant
  riskLevel: "low", // low | medium | high
  sort: 100,
  tagsInput: "", // 逗号分隔输入，提交时再拆分
});

/** -------- 通用校验函数（传入当前 state） -------- */
function validatePermission(
  state: any,
  { isEdit = false, ignoreId }: { isEdit?: boolean; ignoreId?: string } = {}
): FormError[] {
  const errors: FormError[] = [];

  const add = (path: string, message: string) => errors.push({ path, message });

  // 名称
  if (!state.name || String(state.name).trim().length < 2) {
    add("name", "名称至少 2 个字符");
  } else if (String(state.name).trim().length > 50) {
    add("name", "名称不应超过 50 字");
  }

  // 代码
  if (!state.code || String(state.code).trim().length < 3) {
    add("code", "代码至少 3 个字符");
  } else if (String(state.code).trim().length > 100) {
    add("code", "代码不应超过 100 字");
  } else if (!codePattern.test(String(state.code).trim())) {
    add("code", "建议形如 module.action 或 module:action（小写/数字/.-_ :）");
  } else if (!isCodeUnique(state.code, ignoreId)) {
    add("code", "代码已存在，请更换");
  }

  // 分类 / 自定义分类
  if (state.category === "__custom__") {
    if (!state.customCategory || !String(state.customCategory).trim()) {
      add("customCategory", "请输入自定义分类");
    }
  }

  // 排序
  const sortNum = Number(state.sort);
  if (!Number.isInteger(sortNum) || sortNum < 0) {
    add("sort", "排序必须是大于等于 0 的整数");
  } else if (sortNum > 9999) {
    add("sort", "排序不应超过 9999");
  }

  // 描述
  if (state.description && String(state.description).length > 500) {
    add("description", "描述不应超过 500 字");
  }

  // 风险等级
  if (!["low", "medium", "high"].includes(state.riskLevel)) {
    add("riskLevel", "请选择风险等级");
  }

  // 作用域
  if (!["system", "tenant"].includes(state.scope)) {
    add("scope", "请选择作用域");
  }

  return errors;
}

/** -------- 将表单映射为后端 payload -------- */
const toPayload = (state: any) => {
  const category =
    state.category === "__custom__"
      ? String(state.customCategory || "").trim()
      : String(state.category || "").trim();

  const tags = String(state.tagsInput || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean)
    .slice(0, 10); // 最多 10 个

  return {
    name: String(state.name || "").trim(),
    code: String(state.code || "").trim(),
    description: String(state.description || "").trim(),
    category,
    enabled: Boolean(state.enabled),
    scope: state.scope,
    risk_level: state.riskLevel, // 如果后端用 snake_case
    sort: Number(state.sort ?? 100),
    tags,
  };
};

/** -------- 提交回调（新增） -------- */
const onCreateSubmit = async (e: FormSubmitEvent<any>) => {
  const errs = validatePermission(newPermissionForm.value);
  if (errs.length) {
    // 让 UForm 展示错误：直接 return 即可（UForm 会显示校验错误）
    return;
  }
  try {
    await permissionStore.createPermission(toPayload(newPermissionForm.value));
    isCreateModalOpen.value = false;
    // 重置
    newPermissionForm.value = {
      name: "",
      code: "",
      description: "",
      category: "",
      customCategory: "",
      enabled: true,
      scope: "system",
      riskLevel: "low",
      sort: 100,
      tagsInput: "",
    };
    await permissionStore.fetchPermissions();
  } catch (error) {
    console.error("创建权限失败:", error);
  }
};

/** -------- 提交回调（编辑） -------- */
const onEditSubmit = async (e: FormSubmitEvent<any>) => {
  if (!editingPermission.value?.id) return;
  const errs = validatePermission(editingForm.value, {
    isEdit: true,
    ignoreId: editingPermission.value.id,
  });
  if (errs.length) {
    return;
  }
  try {
    await permissionStore.updatePermission(
      editingPermission.value.id,
      toPayload(editingForm.value)
    );
    isEditModalOpen.value = false;
    editingPermission.value = null;
    editingForm.value = null;
    await permissionStore.fetchPermissions();
  } catch (error) {
    console.error("更新权限失败:", error);
  }
};

/** -------- 打开编辑弹窗时填充表单 -------- */
const editPermission = (permission: any) => {
  editingPermission.value = { ...permission };
  const exists = categoryOptions.value.some(
    (o) => o.value === permission?.category
  );
  editingForm.value = {
    name: permission?.name || "",
    code: permission?.code || "",
    description: permission?.description || "",
    category: exists ? permission?.category : "__custom__",
    customCategory: exists ? "" : permission?.category || "",
    enabled: permission?.enabled ?? true,
    scope: permission?.scope || "system",
    riskLevel: permission?.risk_level || "low",
    sort: typeof permission?.sort === "number" ? permission.sort : 100,
    tagsInput: Array.isArray(permission?.tags)
      ? permission.tags.join(", ")
      : "",
  };
  isEditModalOpen.value = true;
};

// 表格列定义（关键修复：每列加入 id）
const columns = [
  { id: "name", key: "name", label: "权限名称", sortable: true },
  { id: "code", key: "code", label: "权限代码", sortable: true },
  { id: "description", key: "description", label: "描述" },
  { id: "category", key: "category", label: "分类", sortable: true },
  { id: "created_at", key: "created_at", label: "创建时间", sortable: true },
  { id: "actions", key: "actions", label: "操作" },
];

// 搜索和过滤
const searchQuery = ref(null);
const selectedCategory = ref(null);

const categories = computed(() => {
  const cats = new Set(
    (permissions.value || [])
      .map((p) => p?.category)
      .filter((v) => v != null && v !== "")
  );
  return Array.from(cats);
});

// 过滤后的权限列表（加空值保护）
const filteredPermissions = computed(() => {
  let filtered = permissions.value || [];

  if (searchQuery.value) {
    const query = String(searchQuery.value || "").toLowerCase();
    filtered = filtered.filter((p) => {
      const name = String(p?.name || "").toLowerCase();
      const code = String(p?.code || "").toLowerCase();
      const desc = String(p?.description || "").toLowerCase();
      return (
        name.includes(query) || code.includes(query) || desc.includes(query)
      );
    });
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((p) => p?.category === selectedCategory.value);
  }

  return filtered;
});

// 新增/编辑表单
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const editingPermission = ref<any | null>(null);

const newPermission = ref({
  name: "",
  code: "",
  description: "",
  category: "",
});

// 重置表单
const resetForm = () => {
  newPermission.value = {
    name: "",
    code: "",
    description: "",
    category: "",
  };
};

// 创建权限
const createPermission = async () => {
  try {
    await permissionStore.createPermission(newPermission.value);
    isCreateModalOpen.value = false;
    resetForm();
    await permissionStore.fetchPermissions(); // 刷新
  } catch (error) {
    console.error("创建权限失败:", error);
  }
};

// 更新权限
const updatePermission = async () => {
  try {
    if (!editingPermission.value?.id) return;
    await permissionStore.updatePermission(
      editingPermission.value.id,
      editingPermission.value
    );
    isEditModalOpen.value = false;
    editingPermission.value = null;
    await permissionStore.fetchPermissions(); // 刷新
  } catch (error) {
    console.error("更新权限失败:", error);
  }
};

// 删除权限
const deletePermission = async (permission: any) => {
  if (confirm(`确定要删除权限 "${permission?.name || ""}" 吗？`)) {
    try {
      await permissionStore.deletePermission(permission.id);
      await permissionStore.fetchPermissions(); // 刷新
    } catch (error) {
      console.error("删除权限失败:", error);
    }
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  await permissionStore.fetchPermissions();
});

// 安全日期格式化
const formatDate = (value?: string | number | Date) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  // 你也可以改成 zh-CN 或用户时区
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
};
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题和操作 -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">权限管理</h1>
        <p class="text-gray-600 mt-1">管理系统权限和访问控制</p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        @click="isCreateModalOpen = true"
      >
        新增权限
      </UButton>
    </div>

    <!-- 搜索和过滤 -->
    <div class="flex gap-4">
      <UInput
        v-model="searchQuery"
        placeholder="搜索权限名称、代码或描述..."
        icon="i-heroicons-magnifying-glass"
        class="flex-1"
      />
      <USelect
        v-model="selectedCategory"
        :items="[
          { label: '全部分类', value: null },
          ...categories.map((c) => ({ label: c, value: c })),
        ]"
        placeholder="全部分类"
        class="w-48"
      />
    </div>

    <!-- 权限列表 -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">权限列表</h3>
          <span class="text-sm text-gray-500">
            共 {{ filteredPermissions.length }} 个权限
          </span>
        </div>
      </template>

      <UTable
        :data="filteredPermissions"
        :columns="columns"
        :loading="isLoading"
        :empty-state="{
          icon: 'i-heroicons-key',
          label: '暂无权限数据',
          description: '点击上方按钮创建第一个权限',
        }"
      >
        <template #name-data="{ row }">
          <div class="font-medium text-gray-900">{{ row.name }}</div>
        </template>

        <template #code-data="{ row }">
          <code class="px-2 py-1 bg-gray-100 rounded text-sm">{{
            row.code
          }}</code>
        </template>

        <template #description-data="{ row }">
          <span class="text-gray-600">{{ row.description || "-" }}</span>
        </template>

        <template #category-data="{ row }">
          <UBadge v-if="row.category" variant="soft">{{ row.category }}</UBadge>
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #created_at-data="{ row }">
          <span class="text-sm text-gray-500">
            {{ formatDate(row.created_at) }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              icon="i-heroicons-pencil"
              size="sm"
              color="gray"
              variant="ghost"
              @click="editPermission(row)"
            />
            <UButton
              icon="i-heroicons-trash"
              size="sm"
              color="red"
              variant="ghost"
              @click="deletePermission(row)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- 新增权限模态框 -->
    <UModal
      title="新增权限"
      description="新增一个权限"
      v-model:open="isCreateModalOpen"
    >
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">新增权限</h3>
          </template>

          <UForm
            :state="newPermissionForm"
            :validate="(state) => validatePermission(state)"
            @submit="onCreateSubmit"
            class="space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="权限名称" name="name" required>
                <UInput
                  v-model="newPermissionForm.name"
                  placeholder="例如：用户创建"
                />
              </UFormField>

              <UFormField
                label="权限代码"
                name="code"
                required
                help="建议 module.action 或 module:action"
              >
                <UInput
                  v-model="newPermissionForm.code"
                  placeholder="例如：user.create"
                />
              </UFormField>

              <UFormField label="分类" name="category">
                <USelect
                  v-model="newPermissionForm.category"
                  :items="[
                    { label: '请选择分类', value: null },
                    ...categoryOptions,
                  ]"
                  placeholder="请选择分类"
                />
              </UFormField>

              <UFormField
                v-if="newPermissionForm.category === '__custom__'"
                label="自定义分类"
                name="customCategory"
                required
              >
                <UInput
                  v-model="newPermissionForm.customCategory"
                  placeholder="输入自定义分类"
                />
              </UFormField>

              <UFormField label="启用" name="enabled">
                <USwitch v-model="newPermissionForm.enabled" />
              </UFormField>

              <UFormField label="风险等级" name="riskLevel">
                <URadioGroup
                  v-model="newPermissionForm.riskLevel"
                  :options="[
                    { label: '低', value: 'low' },
                    { label: '中', value: 'medium' },
                    { label: '高', value: 'high' },
                  ]"
                />
              </UFormField>

              <UFormField
                label="作用域"
                name="scope"
                help="system：系统级；tenant：租户级"
              >
                <URadioGroup
                  v-model="newPermissionForm.scope"
                  :options="[
                    { label: '系统级', value: 'system' },
                    { label: '租户级', value: 'tenant' },
                  ]"
                />
              </UFormField>

              <UFormField
                label="排序权重"
                name="sort"
                help="数值越小优先级越高"
              >
                <UInput
                  v-model.number="newPermissionForm.sort"
                  type="number"
                  min="0"
                  max="9999"
                />
              </UFormField>

              <UFormField
                label="标签"
                name="tagsInput"
                help="以逗号分隔，如：用户, 管理"
              >
                <UInput
                  v-model="newPermissionForm.tagsInput"
                  placeholder="例如：用户, 管理"
                />
              </UFormField>
            </div>

            <UFormField label="描述" name="description">
              <UTextarea
                v-model="newPermissionForm.description"
                placeholder="输入权限描述（可选）"
              />
            </UFormField>

            <div class="flex justify-end gap-3 pt-2">
              <UButton
                color="gray"
                variant="ghost"
                @click="isCreateModalOpen = false"
                >取消</UButton
              >
              <UButton color="primary" type="submit">创建权限</UButton>
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>

    <!-- 编辑权限模态框 -->
    <UModal
      title="编辑权限"
      description="编辑权限"
      v-model:open="isEditModalOpen"
    >
      <template #content>
        <UCard v-if="editingForm">
          <template #header>
            <h3 class="text-lg font-semibold">编辑权限</h3>
          </template>

          <UForm
            :state="editingForm"
            :validate="
              (state) =>
                validatePermission(state, {
                  isEdit: true,
                  ignoreId: editingPermission?.id,
                })
            "
            @submit="onEditSubmit"
            class="space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="权限名称" name="name" required>
                <UInput
                  v-model="editingForm.name"
                  placeholder="例如：用户创建"
                />
              </UFormField>

              <UFormField
                label="权限代码"
                name="code"
                required
                help="建议 module.action 或 module:action"
              >
                <UInput
                  v-model="editingForm.code"
                  placeholder="例如：user.create"
                />
              </UFormField>

              <UFormField label="分类" name="category">
                <USelect
                  v-model="editingForm.category"
                  :items="[
                    { label: '请选择分类', value: null },
                    ...categoryOptions,
                  ]"
                  placeholder="请选择分类"
                />
              </UFormField>

              <UFormField
                v-if="editingForm.category === '__custom__'"
                label="自定义分类"
                name="customCategory"
                required
              >
                <UInput
                  v-model="editingForm.customCategory"
                  placeholder="输入自定义分类"
                />
              </UFormField>

              <UFormField label="启用" name="enabled">
                <USwitch v-model="editingForm.enabled" />
              </UFormField>

              <UFormField label="风险等级" name="riskLevel">
                <URadioGroup
                  v-model="editingForm.riskLevel"
                  :options="[
                    { label: '低', value: 'low' },
                    { label: '中', value: 'medium' },
                    { label: '高', value: 'high' },
                  ]"
                />
              </UFormField>

              <UFormField label="作用域" name="scope">
                <URadioGroup
                  v-model="editingForm.scope"
                  :options="[
                    { label: '系统级', value: 'system' },
                    { label: '租户级', value: 'tenant' },
                  ]"
                />
              </UFormField>

              <UFormField
                label="排序权重"
                name="sort"
                help="数值越小优先级越高"
              >
                <UInput
                  v-model.number="editingForm.sort"
                  type="number"
                  min="0"
                  max="9999"
                />
              </UFormField>

              <UFormField
                label="标签"
                name="tagsInput"
                help="以逗号分隔，如：用户, 管理"
              >
                <UInput
                  v-model="editingForm.tagsInput"
                  placeholder="例如：用户, 管理"
                />
              </UFormField>
            </div>

            <UFormField label="描述" name="description">
              <UTextarea
                v-model="editingForm.description"
                placeholder="输入权限描述（可选）"
              />
            </UFormField>

            <div class="flex justify-end gap-3 pt-2">
              <UButton
                color="gray"
                variant="ghost"
                @click="isEditModalOpen = false"
                >取消</UButton
              >
              <UButton color="primary" type="submit">保存更改</UButton>
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
