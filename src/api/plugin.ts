import axios from 'axios';

export interface ServerPluginRoute {
  name: string;
  path: string;
  meta: {
    locale: string;
    icon?: string;
  };
}

export interface GetSeverPluginRoutesResult {
  routes: ServerPluginRoute[];
}

export function getSeverPluginRoutes() {
  return axios.get<GetSeverPluginRoutesResult>('/plugin/v1/frontend-routes');
}
