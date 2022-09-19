import { defineConfig } from '@umijs/max';

import defaultSettings from './config/defaultSettings';
import routes from './config/routes';

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
  routes: routes,
  npmClient: 'yarn',
});
