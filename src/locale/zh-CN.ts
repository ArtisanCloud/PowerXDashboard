import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeEmployee from '@/views/admin/employee/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.home': '主页',
  'menu.home.index': '首页',
  'menu.dashboard': '仪表盘',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.visualization': '数据可视化',
  'menu.profile': '详情页',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',

  'menu.admin': '管理',
  'menu.admin.employee': '员工管理',
  'menu.admin.employee.detail': '员工详情',
  'menu.admin.permission': '权限管理',
  'menu.admin.permission.role': '角色管理',
  'menu.admin.organization': '组织管理',
  'menu.admin.organization.department': '部门管理',
  'menu.admin.organization.department.list': '部门列表',
  'menu.admin.organization.position': '职位管理',
  'menu.admin.organization.jobTitle': '职级管理',
  'menu.scrm': '企微SCRM',
  'menu.scrm.customer': '客户管理',
  'menu.scrm.customer.detail': '客户详情',
  'menu.scrm.customerGroup': '客户群管理',
  'menu.scrm.tag': '标签管理',
  'menu.scrm.sessionArchive': '会话存档',
  'menu.scrm.enterpriseQR': '企微活码',
  'menu.scrm.smartCS': '智能客服',

  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeEmployee,
};
