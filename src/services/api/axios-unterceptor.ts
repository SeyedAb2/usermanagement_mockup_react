import axios from "axios";
import { BASE_API_URL } from "../../environment/environment";
import { sleep } from "../../shared/utils/sleepDlay";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    await sleep(1000);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("کاربر احراز هویت نشده!");
    }
    return Promise.reject(error);
  }
);

export default api;