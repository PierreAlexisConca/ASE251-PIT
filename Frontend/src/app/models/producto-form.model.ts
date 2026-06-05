import { Categoria } from './categoria';
import { Seccion } from './seccion';

export interface ProductoFormModel {
  id: number | null;
  codigo: string;
  nombre: string;
  detalle: string;
  categoria: Categoria | null;
  stock: number;
  unidad: string;
  seccion: Seccion | null;
}
