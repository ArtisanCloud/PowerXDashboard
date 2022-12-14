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
  define: {
    BASE_URL: process.env.REACT_APP_BASE_URL || 'http://localhost:8080',
    APP_WX_OAUTH_URL:
      process.env.REACT_APP_WX_OAUTH_URL ||
      'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=ww454dfb9d6f6d432a&agentid=1000005&redirect_uri=https://michael-web.debug.artisancloud.cn/user/wx/authorized&state=code',
  },
});
