export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  detalle: string;
  categoria: string;
  stock: number;
  unidad: string;
  seccion: string;
  status?: string;
}
