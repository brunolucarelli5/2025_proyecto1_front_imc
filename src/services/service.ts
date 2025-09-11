import api from "./api";

export const apiService = {
  async findAll() {
    const { data } = await api.get("/findAll");
    return data;
  },

  async findAllDesc() {
    const { data } = await api.get("/findAllDesc");
    return data;
  },

  async findPag(page = 1, limit = 5) {
    const { data } = await api.get("/findPag", {
      params: { page, limit },
    });

    /**
     * Esperamos que el back devuelva algo así:
     * {
     *   items: [...],
     *   totalItems: 42
     * }
     */
    return data;
  },

  async calcular(altura: number, peso: number) {
    const { data } = await api.post("/calcular", { altura, peso });
    return data;
  },
};
