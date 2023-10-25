import axios from 'axios';

const PrefixUriPlugin = '/api/v1/plugin/v1';

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
  return axios.get<GetSeverPluginRoutesResult>(
    `${PrefixUriPlugin}/frontend-routes`,
  );
}
