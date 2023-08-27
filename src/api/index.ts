export const PrefixUriAdmin = '/api/v1/admin';
export const DefaultPageSize = 10;
export const MaxPageSize = 399;

const OSSHost = import.meta.env.VITE_OSS_URL;
const ResourceHost = import.meta.env.VITE_RESOURCE_URL;

export const staticUrl = (uri: string): string => {
  if (uri === undefined) {
    return '';
  }
  const normalizedUri = uri.startsWith('/') ? uri.slice(1) : uri;
  return `${ResourceHost}/${normalizedUri}`;
};

export const ossUrl = (uri: string): string => {
  if (uri === undefined) {
    return '';
  }
  const normalizedUri = uri.startsWith('/') ? uri.slice(1) : uri;
  return `${OSSHost}/${normalizedUri}`;
};
