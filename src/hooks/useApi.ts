import { useContext } from 'react';
import { ApiContext, buildUrl as buildUrlUtil } from '../config/ApiContext';

export function useApi() {
  const { baseUrl } = useContext(ApiContext);
  const buildUrl = (path: string) => buildUrlUtil(baseUrl, path);
  return { baseUrl, buildUrl };
}


