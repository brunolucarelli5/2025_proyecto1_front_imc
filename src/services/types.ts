export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export type CalculoImc = {
  fecha: string;
  fecha_calculo?: string; //deuda técnica
  peso: number;
  altura: number;
  imc: number;
  categoria: string;
};