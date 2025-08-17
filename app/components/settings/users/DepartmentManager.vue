<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useI18n } from "#imports"; // Nuxt i18n composable（或 'vue-i18n' 视你的项目配置）

const { t } = useI18n();

// ✅ 用 computed + t 保证 label 始终是字符串，且随语言切换更新
const columns = computed(() => [
  {
    id: "name",
    key: "name",
    label: String(t("organization.department.table.name")),
  },
  {
    id: "code",
    key: "code",
    label: String(t("organization.department.table.code")),
  },
  {
    id: "leader",
    key: "leader",
    label: String(t("organization.department.table.leader")),
  },
  {
    id: "memberCount",
    key: "memberCount",
    label: String(t("organization.department.table.memberCount")),
  },
  {
    id: "description",
    key: "description",
    label: String(t("organization.department.table.description")),
  },
  {
    id: "actions",
    key: "actions",
    label: String(t("organization.department.table.actions")),
  },
]);

// 模拟部门数据
const departments = ref([
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

// 搜索关键词
const searchQuery = ref("");

// 表单状态
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

const openEditForm = (dept: any) => {
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
        name: departmentForm.name,
        code: departmentForm.code,
        leader: departmentForm.leader,
        description: departmentForm.description,
      };
    }
  } else {
    const newId = Math.max(0, ...departments.value.map((d) => d.id)) + 1;
    departments.value.push({
      id: newId,
      name: departmentForm.name,
      code: departmentForm.code,
      leader: departmentForm.leader,
      description: departmentForm.description,
      memberCount: 0,
    });
  }
  showForm.value = false;
  resetForm();
};

const deleteDepartment = (id: number) => {
  if (confirm("确定要删除此部门吗？")) {
    departments.value = departments.value.filter((d) => d.id !== id);
  }
};

// 过滤
const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value;
  const q = searchQuery.value.toLowerCase();
  return departments.value.filter(
    (dept) =>
      dept.name.toLowerCase().includes(q) ||
      dept.code.toLowerCase().includes(q) ||
      dept.leader.toLowerCase().includes(q) ||
      dept.description.toLowerCase().includes(q)
  );
});
</script>

<template>
  <div>
    <!-- 头部 -->
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
    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        :placeholder="$t('organization.department.search')"
        class="w-full md:w-80"
      />
    </div>

    <!-- 表格 -->
    <!-- ✅ columns 是 computed，模板中会自动解包，不需要 .value -->
    <UTable :columns="columns" :rows="filteredDepartments">
      <!-- 操作列 -->
      <template #actions-data="{ row }">
        <div class="flex space-x-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            size="xs"
            @click="openEditForm(row)"
          >
            {{ $t("organization.common.edit") }}
          </UButton>
          <UButton
            color="error"
            variant="ghost"
            icon="i-heroicons-trash"
            size="xs"
            @click="deleteDepartment(row.id)"
          >
            {{ $t("organization.common.delete") }}
          </UButton>
        </div>
      </template>
    </UTable>

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

    <!-- 弹窗表单 -->
    <UModal v-model="showForm" :ui="{ width: 'sm:max-w-md' }">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{
            isEditing
              ? $t("organization.department.edit")
              : $t("organization.department.add")
          }}
        </h3>

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

            <UFormField :label="$t('organization.department.form.description')">
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
      </div>
    </UModal>
  </div>
</template>
