import { Categoria } from './categoria';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  detalle: string;
  categoria: { id: number; nombre: string } | null;
  stock: number;
  unidad: string;
  seccion: { id: number; nombre: string } | null;
  status?: string;
}
