import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  title: 'PowerX - Dashboard',
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSidebar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
} as LayoutSettings & {
  pwa: boolean;
};
