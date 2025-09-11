import api from "./api";

export type CalculoImc = {
  fecha: string;
  peso: number;
  altura: number;
  imc: number;
  categoria: string;
};

export const apiService = {
  async findAll() {
    const { data } = await api.get("/findAll");
    return data;
  },

  async findAllDesc() {
    const { data } = await api.get("/findAllDesc");
    return data;
  },

  async getHistorial(pag: number, mostrar: number) {
    const { data } = await api.get("/imc/pag", {
      params: { pag, mostrar },
    });
    return data;
  },

  async calcular(altura: number, peso: number) {
    const { data } = await api.post("/calcular", { altura, peso });
    return data;
  },
};
