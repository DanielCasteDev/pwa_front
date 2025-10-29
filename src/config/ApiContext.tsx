/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import { API_URL } from './api';

export const API_BASE_URL: string = import.meta.env?.VITE_API_BASE_URL || API_URL;

export type ApiConfig = { baseUrl: string };

export const ApiContext = createContext<ApiConfig>({ baseUrl: API_BASE_URL });

type ApiProviderProps = { baseUrl?: string; children: ReactNode };

export function ApiProvider({ baseUrl, children }: ApiProviderProps) {
  const value: ApiConfig = { baseUrl: baseUrl || API_BASE_URL };
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function buildUrl(baseUrl: string, path: string): string {
  try {
    const url = new URL(path, baseUrl);
    return url.toString();
  } catch {
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}

export function useApi() {
  const { baseUrl } = useContext(ApiContext);
  const build = (path: string) => buildUrl(baseUrl, path);
  return { baseUrl, buildUrl: build };
}
