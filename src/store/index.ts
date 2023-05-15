import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useOptionsStore from './modules/data-dictionary';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useOptionsStore };
export default pinia;
