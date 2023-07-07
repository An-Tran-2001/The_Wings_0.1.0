import axios from "axios";
import { API_TIMEOUT, API_URL } from "constant/index";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.timeout = API_TIMEOUT;

const client = {
  get: async (endpoint: string, params = {}) => {
    try {
      const response = await axios.get(endpoint, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint: string, body: {}) => {
    try {
      const response = await axios.post(endpoint, body);

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
