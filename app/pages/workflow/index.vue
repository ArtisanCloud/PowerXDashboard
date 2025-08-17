<template>
  <div class="workflow-page">
    <UCard class="workflow-card">
      <template #header>
        <div class="workflow-header">
          <h1 class="workflow-title">
            <Icon name="i-heroicons-squares-2x2" class="mr-2" />
            工作流编辑器
          </h1>
          <div class="workflow-actions">
            <UButton
              icon="i-heroicons-document-plus"
              color="primary"
              @click="createNewWorkflow"
            >
              新建工作流
            </UButton>
            <UButton
              icon="i-heroicons-folder-open"
              color="neutral"
              variant="ghost"
              @click="openWorkflow"
            >
              打开工作流
            </UButton>
          </div>
        </div>
      </template>

      <div class="workflow-container">
        <WorkflowEditor v-if="workflowLoaded" />
        <div v-else class="workflow-empty">
          <div class="workflow-empty-icon">
            <Icon name="i-heroicons-squares-2x2" size="48" />
          </div>
          <h2 class="workflow-empty-title">开始创建工作流</h2>
          <p class="workflow-empty-desc">创建新工作流或打开现有工作流</p>
          <div class="workflow-empty-actions">
            <UButton
              icon="i-heroicons-document-plus"
              color="primary"
              @click="createNewWorkflow"
            >
              新建工作流
            </UButton>
            <UButton
              icon="i-heroicons-folder-open"
              color="neutral"
              variant="ghost"
              @click="openWorkflow"
            >
              打开工作流
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- 新建工作流对话框 -->
    <UModal v-model="showNewWorkflowModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center">
              <Icon name="i-heroicons-document-plus" class="mr-2" />
              新建工作流
            </div>
          </template>

          <div class="space-y-4">
            <UFormField label="工作流名称" required>
              <UInput v-model="newWorkflow.name" placeholder="输入工作流名称" />
            </UFormField>

            <UFormField label="描述">
              <UTextarea
                v-model="newWorkflow.description"
                placeholder="输入工作流描述（可选）"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                @click="showNewWorkflowModal = false"
              >
                取消
              </UButton>
              <UButton
                color="primary"
                :disabled="!newWorkflow.name"
                @click="confirmCreateWorkflow"
              >
                创建
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- 打开工作流对话框 -->
    <UModal v-model="showOpenWorkflowModal">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <Icon name="i-heroicons-folder-open" class="mr-2" />
            打开工作流
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-if="workflowList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            没有可用的工作流
          </div>

          <UTable v-else :columns="workflowColumns" :rows="workflowList">
            <template #actions-data="{ row }">
              <UButton
                color="primary"
                size="sm"
                @click="loadSelectedWorkflow(row.id)"
              >
                打开
              </UButton>
            </template>
          </UTable>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              @click="showOpenWorkflowModal = false"
            >
              取消
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useWorkflowManager } from "~/composables/workflow/useWorkflowManager";
import WorkflowEditor from "~/components/workflow/WorkflowEditor.vue";

// 工作流管理器
const {
  currentWorkflow,
  createNewWorkflow: createWf,
  loadWorkflow,
  getWorkflowList,
} = useWorkflowManager();

// 状态
const workflowLoaded = ref(false);
const showNewWorkflowModal = ref(false);
const showOpenWorkflowModal = ref(false);
const newWorkflow = reactive({
  name: "",
  description: "",
});
interface WorkflowItem {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
}

const workflowList = ref<WorkflowItem[]>([]);

// 工作流列表列定义
const workflowColumns = [
  { key: "name", label: "名称" },
  { key: "description", label: "描述" },
  { key: "updatedAt", label: "更新时间" },
  { key: "actions", label: "操作" },
];

// 创建新工作流
function createNewWorkflow() {
  showNewWorkflowModal.value = true;
}

// 确认创建工作流
async function confirmCreateWorkflow() {
  if (!newWorkflow.name) return;

  const workflow = await createWf(newWorkflow.name, newWorkflow.description);
  if (workflow) {
    showNewWorkflowModal.value = false;

    // 重置表单
    newWorkflow.name = "";
    newWorkflow.description = "";

    // 跳转到工作区页面
    await navigateTo(`/workflow/workspace?id=${workflow.id}`);
  }
}

// 打开工作流
async function openWorkflow() {
  try {
    const workflows = await getWorkflowList();
    workflowList.value = workflows;
    showOpenWorkflowModal.value = true;
  } catch (err) {
    console.error("加载工作流列表失败", err);
  }
}

// 加载选中的工作流
async function loadSelectedWorkflow(id: string) {
  // 跳转到工作区页面
  await navigateTo(`/workflow/workspace?id=${id}`);
}

// 组件挂载
onMounted(() => {
  // 检查是否有工作流ID参数
  const urlParams = new URLSearchParams(window.location.search);
  const workflowId = urlParams.get("id");

  if (workflowId) {
    loadSelectedWorkflow(workflowId);
  }
});
</script>

<style scoped>
.workflow-page {
  padding: 16px;
  height: 100%;
}

.workflow-card {
  height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
}

.workflow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.workflow-title {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.workflow-actions {
  display: flex;
  gap: 8px;
}

.workflow-container {
  flex: 1;
  overflow: hidden;
}

.workflow-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
}

.workflow-empty-icon {
  color: #9ca3af;
  margin-bottom: 16px;
}

.workflow-empty-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.workflow-empty-desc {
  color: #6b7280;
  margin-bottom: 24px;
}

.workflow-empty-actions {
  display: flex;
  gap: 12px;
}
</style>
