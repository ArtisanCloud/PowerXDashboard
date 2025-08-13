<template>
  <div 
    :class="[
      'wf-node', 
      `wf-node-${nodeData.ui.shape}`, 
      `wf-node-${nodeData.ui.colorToken || 'default'}`
    ]"
    :style="nodeStyle"
  >
    <!-- 节点头部 -->
    <div class="wf-node-header">
      <div class="wf-node-icon" v-if="nodeData.ui.icon">
        <Icon :name="nodeData.ui.icon" />
      </div>
      <div class="wf-node-title">{{ nodeData.label }}</div>
      <div class="wf-node-badges" v-if="nodeData.ui.badges && nodeData.ui.badges.length">
        <span 
          v-for="badge in nodeData.ui.badges" 
          :key="badge" 
          class="wf-node-badge"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <!-- 节点内容 -->
    <div class="wf-node-content">
      <!-- 如果有自定义组件，则使用自定义组件 -->
      <component 
        v-if="nodeData.ui.component && registeredComponents[nodeData.ui.component]" 
        :is="registeredComponents[nodeData.ui.component]"
        :node-data="nodeData"
        @update:props="updateProps"
      />
      <!-- 否则使用默认预览模板 -->
      <div v-else-if="nodeData.ui.previewTpl" class="wf-node-preview">
        {{ renderPreviewTemplate(nodeData.ui.previewTpl, nodeData.props) }}
      </div>
      <!-- 最简单的情况，显示属性数量 -->
      <div v-else class="wf-node-props-count">
        {{ Object.keys(nodeData.props).length }} 个属性
      </div>
    </div>

    <!-- 输入端口 -->
    <template v-for="port in nodeData.ports.inputs" :key="`in-${port.name}`">
      <div 
        :class="['wf-node-port', 'wf-node-port-in']"
        :style="getPortPosition('in', port.name)"
      >
        <div class="wf-node-port-handle" :data-handle-id="port.name" />
        <div class="wf-node-port-label">{{ port.label || port.name }}</div>
      </div>
    </template>

    <!-- 输出端口 -->
    <template v-for="port in nodeData.ports.outputs" :key="`out-${port.name}`">
      <div 
        :class="['wf-node-port', 'wf-node-port-out']"
        :style="getPortPosition('out', port.name)"
      >
        <div class="wf-node-port-label">{{ port.label || port.name }}</div>
        <div class="wf-node-port-handle" :data-handle-id="port.name" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { NodeData } from '~/types/workflow';

const props = defineProps<{
  id: string;
  data: NodeData;
  selected: boolean;
}>();

// 注册的自定义组件
const registeredComponents = inject('workflowComponents', {});

// 节点数据
const nodeData = computed(() => props.data);

// 节点样式
const nodeStyle = computed(() => {
  const { size } = nodeData.value.ui;
  return {
    width: size?.w ? `${size.w}px` : 'auto',
    minHeight: size?.h ? `${size.h}px` : 'auto',
  };
});

// 获取端口位置
function getPortPosition(type: 'in' | 'out', portName: string) {
  const handles = nodeData.value.ui.handles || {};
  
  // 默认位置映射
  const defaultPositions = {
    in: 'left',
    out: 'right'
  };
  
  // 查找端口在哪个位置
  let position = defaultPositions[type];
  
  for (const [pos, ports] of Object.entries(handles)) {
    if (Array.isArray(ports) && ports.includes(portName)) {
      position = pos;
      break;
    }
  }
  
  return {
    '--port-position': position,
  };
}

// 渲染预览模板
function renderPreviewTemplate(template: string, props: Record<string, any>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.trim().split('.');
    let value = props;
    
    for (const key of keys) {
      if (value === undefined || value === null) return '';
      value = value[key];
    }
    
    return value !== undefined && value !== null ? String(value) : '';
  });
}

// 更新节点属性
function updateProps(newProps: Record<string, any>) {
  // 通知父组件更新属性
  emit('update:props', newProps);
}

const emit = defineEmits(['update:props']);
</script>

<style scoped>
.wf-node {
  position: relative;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  overflow: visible;
}

.wf-node.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

/* 节点形状 */
.wf-node-card {
  border-radius: 8px;
}

.wf-node-diamond {
  transform: rotate(45deg);
}

.wf-node-diamond > * {
  transform: rotate(-45deg);
}

.wf-node-pill {
  border-radius: 24px;
}

.wf-node-minimal {
  box-shadow: none;
  background-color: transparent;
}

/* 颜色主题 */
.wf-node-primary {
  border-color: #3b82f6;
}

.wf-node-success {
  border-color: #10b981;
}

.wf-node-warning {
  border-color: #f59e0b;
}

.wf-node-info {
  border-color: #60a5fa;
}

.wf-node-danger {
  border-color: #ef4444;
}

/* 节点头部 */
.wf-node-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.wf-node-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.wf-node-title {
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-node-badges {
  display: flex;
  gap: 4px;
}

.wf-node-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: #e5e7eb;
  color: #4b5563;
}

/* 节点内容 */
.wf-node-content {
  padding: 8px 12px;
  font-size: 12px;
  color: #4b5563;
}

.wf-node-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: monospace;
}

.wf-node-props-count {
  color: #9ca3af;
  font-style: italic;
}

/* 端口样式 */
.wf-node-port {
  position: absolute;
  display: flex;
  align-items: center;
  font-size: 10px;
}

.wf-node-port-in {
  left: 0;
  transform: translateX(-50%);
}

.wf-node-port-out {
  right: 0;
  transform: translateX(50%);
}

.wf-node-port-handle {
  width: 10px;
  height: 10px;
  background-color: #9ca3af;
  border-radius: 50%;
  cursor: crosshair;
}

.wf-node-port-in .wf-node-port-handle {
  margin-right: 4px;
}

.wf-node-port-out .wf-node-port-handle {
  margin-left: 4px;
}

.wf-node-port-label {
  white-space: nowrap;
  color: #6b7280;
}
</style>