import { defineComponent } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { AppRouteRecordRaw } from '@/router/routes/types';
import WujieVue3 from 'wujie-vue3';

const pluginEndpoint = import.meta.env.VITE_PLUGIN_ENDPOINT;

interface Option {
  key: any;
  name: any;
  url: string;
  [propName: string]: any;
}

export function CreateWujieComponent(option: Option) {
  return defineComponent({
    components: {
      WujieVue3,
    },
    setup() {
      return {
        option,
      };
    },
    template: `
      <div class="container">
        <WujieVue3 v-bind="option" />
      </div>
    `,
  });
}

export function BuildPluginRoutes(
  routes: RouteRecordRaw[],
): AppRouteRecordRaw[] {
  return routes.map((route) => {
    route.component = CreateWujieComponent({
      key: route.name,
      name: route.name,
      url: `${pluginEndpoint}${route.path}`,
    });
    route.path = `/plugin${route.path}`;
    return route as AppRouteRecordRaw;
  });
}
