import axios, { AxiosRequestConfig } from "axios";
import { API_TIMEOUT, API_URL } from "constant/index";
import { TOKEN_KEY } from "constant/path";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.timeout = API_TIMEOUT;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

const client = {
  get: async (endpoint: string, params = {}) => {
    try {
      const response = await axios.get(endpoint, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint: string, body: {}, config?: AxiosRequestConfig) => {
    try {
      const response = await axios.post(endpoint, body, config);

      return response;
    } catch (error) {
      throw error;
    }
  },

  put: async (endpoint: string, body: {}) => {
    try {
      const response = await axios.put(endpoint, body);
      return response;
    } catch (error) {
      throw error;
    }
  },

  delete: async (endpoint: string, data?: {}) => {
    try {
      const response = await axios.delete(endpoint, { data });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default client;
