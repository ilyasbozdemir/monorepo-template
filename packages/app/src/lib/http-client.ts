import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosHeaders,
} from "axios";
import { ApiError } from "./error";
import { createApi } from "@monorepo/core";

export const mongoHttpClientOriginAxios = createApi({
  baseURL: "http://localhost:58837",
  token: process.env.MONGO_APIKEY_DEVELOPMENT!,
  defaultHeaders: new AxiosHeaders({
    Accept: "application/json",
  }),
  safeMode: true,
});

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string, apiKey: string, timeout = 5000) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  private handleError(err: unknown): ApiError {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError;
      return new ApiError(
        axiosErr.response?.status || 500,
        axiosErr.response?.data || axiosErr.message
      );
    }
    return new ApiError(500, (err as Error).message);
  }
}

