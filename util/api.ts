import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";

const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (hasCookie("token")) {
    config.headers.Authorization = `Bearer ${getCookie("token")}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      deleteCookie("token");
      console.log("Unauthorized! Redirecting to login page...");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

export interface Response<T> {
  success: boolean;
  message: string;
  statusCode: number;
  metadata: T;
}

export const fetcher = <T>(url: string) =>
  api.get<Response<T>>(url).then((res) => res as unknown as Response<T>);

export const Api_MiniApp = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_MINIAPP,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const requestWithContentType = async (
  method: AxiosRequestConfig["method"],
  url: string,
  data: unknown = {},
  headers: Record<string, string> = {}
) => {
  return api.request({
    method,
    url,
    data,
    headers: {
      ...api.defaults.headers,
      ...headers,
    } as Record<string, string>,
  });
};
