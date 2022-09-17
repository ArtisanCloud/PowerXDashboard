import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeEmployee from '@/views/admin/employee/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.home': 'Home',
  'menu.home.index': 'Index',
  'menu.dashboard': 'Dashboard',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.server.dashboard': 'Dashboard (Server)',
  'menu.server.workplace': 'Workplace (Server)',
  'menu.server.monitor': 'Real-time Monitor (Server)',
  'menu.visualization': 'Data Visualization',
  'menu.profile': 'Profile',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Documentation',
  'navbar.action.locale': 'Switch to Chinese',

  'menu.admin': 'Management',
  'menu.admin.employee': 'Employee Management',
  'menu.admin.employee.detail': 'Employee Detail',
  'menu.admin.permission': 'Permission Management',
  'menu.admin.permission.role': 'Role Management',
  'menu.admin.organization': 'Organization Management',
  'menu.admin.organization.department': 'Department Management',
  'menu.admin.organization.department.list': 'Department List',
  'menu.admin.organization.position': 'Position Management',
  'menu.admin.organization.jobTitle': 'Job Title Management',
  'menu.scrm': 'WeChat SCRM',
  'menu.scrm.customer': 'Customer Management',
  'menu.scrm.customer.detail': 'Customer Detail',
  'menu.scrm.customerGroup': 'Customer Group Management',
  'menu.scrm.tag': 'Tag Management',
  'menu.scrm.sessionArchive': 'Session Archive',
  'menu.scrm.enterpriseQR': 'WeChat Enterprise QR Code',
  'menu.scrm.smartCS': 'Smart Customer Service',

  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeEmployee,
};
