import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Cambia a tu URL real
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, 
});

export default api;
