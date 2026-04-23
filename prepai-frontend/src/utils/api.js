import axios from "axios";
import { auth } from "../firebase";
import { getIdToken } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await getIdToken(currentUser, false);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
 