import { defineConfig } from '@umijs/max';

import defaultSettings from './config/defaultSettings';

export default defineConfig({
  antd: {
    // configProvider
    configProvider: {},
    // themes
    dark: false,
    compact: false,
    // babel-plugin-import
    import: true,
    // less or css, default less
    style: 'less',
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    locale: true,
    ...defaultSettings,
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'yarn',
});
