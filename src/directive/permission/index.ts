import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

// 检查用户是否具有所需权限的函数
function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { roles } = userStore;

  // 检查绑定值是否为数组
  if (Array.isArray(value)) {
    // 如果数组长度大于0，则检查用户角色是否在所需角色数组中
    if (value.length > 0) {
      const hasPermission = value.includes(roles);
      // 如果用户没有权限且元素有父节点，则从DOM中移除元素
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    // 如果绑定值不是数组，则抛出错误
    throw new Error(`need roles! Like v-permission="['admin','user']"`);
  }
}

// 导出自定义指令
export default {
  // 当元素挂载时，检查权限
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  // 当元素更新时，再次检查权限
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
