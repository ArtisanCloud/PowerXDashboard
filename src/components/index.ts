import { App } from 'vue';
import { Icon } from '@arco-design/web-vue';
import Breadcrumb from './breadcrumb/index.vue';

const IconFont = Icon.addFromIconFontCn({
  src: 'https://at.alicdn.com/t/c/font_4270227_h59q7voua6.js',
});

export default {
  install(Vue: App) {
    Vue.component('Breadcrumb', Breadcrumb);
    Vue.component('IconFont', IconFont);
  },
};
