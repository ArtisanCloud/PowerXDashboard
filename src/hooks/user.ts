import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';

export default function useUser() {
  const router = useRouter();
  const userStore = useUserStore();
  const logout = async (logoutTo?: string) => {
    Message.success('登出成功');
    await router
      .push({
        name: logoutTo || 'login',
      })
      .finally(() => {
        userStore.logout();
      });
  };
  return {
    logout,
  };
}
