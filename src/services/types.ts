// Datos necesarios para registrar un nuevo usuario
export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Datos necesarios para iniciar sesión
export interface LoginDTO {
  email: string;
  password: string;
}

// Respuesta de autenticación que devuelve el backend (tokens)
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// Representa un cálculo de IMC con su fecha y categoría
// Deuda técnica: fecha_calculo es redundante y debería unificarse con fecha
export type CalculoImc = {
  fecha_calculo: Date;
  peso: number;
  altura: number;
  imc: number;
  categoria: string;
};
