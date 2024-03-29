export const WHITE_LIST = [
  { name: 'NotFound', children: [] },
  { name: 'Login', children: [] },
  { name: 'Home', children: ['HomeIndex'] },
];

export const NOT_FOUND = {
  name: 'notFound',
};

export const REDIRECT_ROUTE_NAME = 'Redirect';
export const NOT_FOUND_ROUTE_NAME = 'NotFound';

export const LOGIN_ROUTE_NAME = 'Login';

export const DEFAULT_ROUTE_NAME = 'HomeIndex';

export const EMPTY_LAYOUT_NAME = 'EmptyLayout';

export const EMPTY_LAYOUT_TAG = 'EMPTY_LAYOUT';

// todo default
export const DEFAULT_ROUTE = {
  title: 'menu.home.index',
  name: DEFAULT_ROUTE_NAME,
  fullPath: '/home/index',
};
