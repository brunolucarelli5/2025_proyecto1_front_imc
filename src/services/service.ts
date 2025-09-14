import axios, { AxiosResponse } from "axios";
import { LoginDTO, RegisterDTO } from "./types";
import { CalculoImc } from "./types";

const api = axios.create({
  baseURL: "http://localhost:3000", // cambia a tu URL real
  headers: { "Content-Type": "application/json" },
});

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
        const params = {
          pag: Number(pag),      
          mostrar: Number(mostrar),
          sort
        };
        const response = await api.get("/imc/pag", { params });
        return response.data;
      } catch (err) {
        console.error("Error en getHistorial:", err);
        throw err;
      }
    },

  async calcular(altura: number, peso: number): Promise<CalculoImc> {
    try {
      const response: AxiosResponse<CalculoImc> = await api.post("/imc/calcular", { altura, peso });
      return response.data;
    } catch (err) {
      console.error("Error en calcular:", err);
      throw err;
    }
  },


  register: (data: RegisterDTO) => {
    // Usa 'api.post' y solo el endpoint específico
    return api.post('/users/register', data);
  },

  // Función para el login
  login: (data: LoginDTO) => {
    // Usa 'api.post' y solo el endpoint específico
    return api.post('/auth/login', data);
  },


};
