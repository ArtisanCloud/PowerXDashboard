import { DEFAULT_LAYOUT, EMPTY_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CRM: AppRouteRecordRaw = {
  path: '/reservation-center',
  name: 'Reservation Center',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.reservationCenter',
    requiresAuth: true,
    icon: 'icon-customer-service',
  },
  children: [
    // reservation center service
    {
      path: '/reservation-center/schedule/calendar',
      name: 'Schedule Calendar',
      component: () => import('@/views/custom/reservation-center/schedule/calendar/index.vue'),
      meta: {
        icon: 'icon-calendar-clock',
        locale: 'menu.reservationCenter.schedule.calendar',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default CRM;
