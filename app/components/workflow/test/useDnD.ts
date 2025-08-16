import { useVueFlow } from '@vue-flow/core'
import {  watch, onUnmounted, type Ref } from 'vue'

let id = 0

/**
 * 生成唯一ID
 * @returns {string} - 唯一ID
 */
function getId(): string {
  return `dndnode_${id++}`
}

/**
 * 拖放状态接口
 */
interface DragDropState {
  draggedType: Ref<string | null>
  isDragOver: Ref<boolean>
  isDragging: Ref<boolean>
}

export default function useDragAndDrop() {
  // 每个组件实例都有自己的状态，避免全局状态冲突
  const draggedType = ref<string | null>(null)
  const isDragOver = ref(false)
  const isDragging = ref(false)

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()

  const unwatchDragging = watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  function onDragStart(event: DragEvent, type: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true

    document.addEventListener('drop', onDragEnd)
  }

  /**
   * 处理拖拽悬停事件
   * @param {DragEvent} event
   */
  function onDragOver(event: DragEvent) {
    event.preventDefault()

    if (draggedType.value) {
      isDragOver.value = true

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false
  }

  function onDragEnd() {
    isDragging.value = false
    isDragOver.value = false
    draggedType.value = null
    document.removeEventListener('drop', onDragEnd)
  }

  /**
   * 处理拖放事件
   * @param {DragEvent} event
   */
  function onDrop(event: DragEvent) {
    event.preventDefault()
    
    if (!draggedType.value) {
      return
    }

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const nodeId = getId()
    const nodeType = draggedType.value // 确保类型不为null

    const newNode = {
      id: nodeId,
      type: nodeType,
      position,
      data: { label: `${nodeType} ${nodeId}` },
    }

    /**
     * 拖放后对齐节点位置，使其以鼠标为中心
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: { 
          x: node.position.x - (node.dimensions?.width || 0) / 2, 
          y: node.position.y - (node.dimensions?.height || 0) / 2 
        },
      }))

      off()
    })

    addNodes(newNode)
    
    // 清理拖拽状态
    onDragEnd()
  }

  // 组件卸载时清理事件监听器和状态
  onUnmounted(() => {
    unwatchDragging()
    document.removeEventListener('drop', onDragEnd)
    document.body.style.userSelect = ''
  })

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  }
}
