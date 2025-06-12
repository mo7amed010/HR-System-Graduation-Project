import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3003/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.authentication = localStorage.getItem("token");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
