export interface AuthUser {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  activo?: boolean;
}