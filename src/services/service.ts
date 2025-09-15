import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthResponse, LoginDTO, RegisterDTO } from "./types";
import { CalculoImc } from "./types";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;

// Interceptor de peticiones (añade el access token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas (maneja la expiración del token)
api.interceptors.response.use(        
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: AxiosRequestConfig = error.config!;
    const refreshToken = localStorage.getItem('refreshToken');

    if (error.response?.status === 401 && !isRefreshing && refreshToken) {
      isRefreshing = true;

      try {
        const res = await axios.get<AuthResponse>('http://localhost:3000/auth/tokens', {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        });

        localStorage.setItem('accessToken', res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
        
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && !refreshToken) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  async findAll(): Promise<CalculoImc[]> {
    try {
      const response: AxiosResponse<CalculoImc[]> = await api.get("/imc/historial");
      return response.data;
    } catch (err) {
      console.error("Error en findAll:", err);
      throw err;
    }
  },

  async findAllDesc(): Promise<CalculoImc[]> {
    try {
      const response: AxiosResponse<CalculoImc[]> = await api.get("/imc/historial");
      return response.data;
    } catch (err) {
      console.error("Error en findAllDesc:", err);
      throw err;
    }
  },

  async getHistorial(
    pag: number = 1,
    mostrar: number = 1000,
    sort: "asc" | "desc" = "desc",
  ): Promise<{ data: CalculoImc[]; total: number }> {
    try {
      const params = { pag, mostrar, sort };
      const response = await api.get("/imc/pag", { params });
      return response.data;
    } catch (err: any) {
      if (err.response?.status !== 401) { //No muestro en consola los 401
        // Nota: No mostramos en consola los 401 porque:
        // - Son parte del flujo normal de autenticación (token expirado).
        // - El interceptor intenta refrescar el token y reintenta la request.
        // - Evitamos ensuciar la consola con errores que no son visibles para el usuario.
        console.error("Error en getHistorial:", err);
      }
      throw err; // se lo paso al interceptor para que haga el refresh
    }
  },

  async calcular(altura: number, peso: number): Promise<CalculoImc> {
    try {
      const response = await api.post("/imc/calcular", { altura, peso });
      return response.data;
    } catch (err: any) {
      if (err.response?.status !== 401) { //No muestro en consola los 401
        console.error("Error en calcular:", err);
      }
      throw err;
    }
  },


  login: (data: LoginDTO) => {
    return api.post<AuthResponse>('/auth/login', data);
  },

  register: (data: RegisterDTO) => {
    return api.post('/users/register', data);
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};