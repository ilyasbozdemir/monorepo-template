import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestHeaders, AxiosHeaders } from 'axios';

interface SafeResponse<T = any> {
  data: T | null;
  status: number;
  message: string;
  error?: boolean;
}

interface ApiSettings {
  baseURL: string;
  token?: string; // global token
  safeMode?: boolean; // true olursa hataları resolve ile döner
  defaultHeaders?: AxiosRequestHeaders;
}

export function createApi(settings: ApiSettings): AxiosInstance {
  const instance = axios.create({
    baseURL: settings.baseURL,
    headers: settings.defaultHeaders || new AxiosHeaders(),
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers = config.headers || new AxiosHeaders();

    // Global token ekle
    if (settings.token) {
      config.headers['Authorization'] = `Bearer ${settings.token}`;
    }

    // Global defaultHeaders varsa ekle (override etmez, eksikleri tamamlar)
    if (settings.defaultHeaders) {
      for (const key in settings.defaultHeaders) {
        if (!(key in config.headers)) {
          config.headers[key] = settings.defaultHeaders[key];
        }
      }
    }

    return config;
  });

  // Response interceptor
  if (settings.safeMode) {
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.resolve({
          data: error.response?.data || null,
          status: error.response?.status || 500,
          statusText: error.response?.statusText || 'Error',
          headers: error.response?.headers || {},
          config: error.config,
        });
      },
    );
  }

  return instance;
}
