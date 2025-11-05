import axios from "axios"
import { logout } from "../features/auth/authSlice";
const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

export const setupInterceptors = (store) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};

export default api