import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import NProgress from 'nprogress';
import setupUserLoginInfoGuard from './userLoginInfo';
import setupPermissionGuard from './permission';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    NProgress.start();

    // can use listenerRouteChange to listen to route changes
    setRouteEmitter(to);
  });
  router.afterEach(() => {
    // delay for 0.05s to improve visual experience
    setTimeout(() => {
      NProgress.done();
    }, 50);
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
}
