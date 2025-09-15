import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { AuthResponse, LoginDTO, RegisterDTO, CalculoImc } from "./types";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const refreshToken = localStorage.getItem("refreshToken");

    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.get<AuthResponse>("http://localhost:3000/auth/tokens", {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        if (res.data.refreshToken) localStorage.setItem("refreshToken", res.data.refreshToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.resolve({ data: null }); // evita mostrar 401 en consola
      } finally {
      }
    }

    if (error.response?.status === 401 && !refreshToken) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.resolve({ data: null }); // evita mostrar 401 en consola
    }

    // Otros errores
    if (error.response?.status !== 401) console.error(error);

    return Promise.reject(error);
  }
);

export const apiService = {
  async calcular(altura: number, peso: number): Promise<CalculoImc | null> {
    try {
      const response = await api.post("/imc/calcular", { altura, peso });
      return response.data;
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.error("Error en calcular:", err);
      }
      return null; // retorna null en caso de 401
    }
  },

  async getHistorial(pag = 1, mostrar = 5, sort: "asc" | "desc" = "desc") {
    try {
      const params = { pag, mostrar, sort };
      const response = await api.get("/imc/pag", { params });
      return response.data;
    } catch (err: any) {
      if (err.response?.status !== 401) console.error("Error en getHistorial:", err);
      return { data: [], total: 0 };
    }
  },

  login: (data: LoginDTO) => api.post<AuthResponse>("/auth/login", data),
  register: (data: RegisterDTO) => api.post("/users/register", data),
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
