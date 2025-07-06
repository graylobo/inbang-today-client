import { getErrorMessage } from "@/libs/utils/error-handler";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  config.withCredentials = true;

  console.log(
    "request path:::",
    `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  );
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(
      "error request path:::",
      `${error.request.method && error.request.method} ${error.config.baseURL}${
        error.request.path && error.request.path
      }`
    );
    return Promise.reject(error.response?.data.errorCode);
  }
);

export { api };
