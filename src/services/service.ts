import axios, { AxiosResponse } from "axios";

export type CalculoImc = {
  fecha: string;
  fecha_calculo?: string;
  peso: number;
  altura: number;
  imc: number;
  categoria: string;
};

const api = axios.create({
  baseURL: "http://localhost:3000/imc", // cambia a tu URL real
  headers: { "Content-Type": "application/json" },
});

export const apiService = {
  async findAll(): Promise<CalculoImc[]> {
    try {
      const response: AxiosResponse<CalculoImc[]> = await api.get("/historial");
      return response.data;
    } catch (err) {
      console.error("Error en findAll:", err);
      throw err;
    }
  },

  async findAllDesc(): Promise<CalculoImc[]> {
    try {
      const response: AxiosResponse<CalculoImc[]> = await api.get("/historial");
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
        const response = await api.get("/pag", { params });
        return response.data;
      } catch (err) {
        console.error("Error en getHistorial:", err);
        throw err;
      }
    },





  async calcular(altura: number, peso: number): Promise<CalculoImc> {
    try {
      const response: AxiosResponse<CalculoImc> = await api.post("/calcular", { altura, peso });
      return response.data;
    } catch (err) {
      console.error("Error en calcular:", err);
      throw err;
    }
  },
};
