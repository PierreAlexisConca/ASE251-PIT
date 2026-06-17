export interface ProductoFormModel {
  id: number | null;
  codigo: string;
  nombre: string;
  detalle: string;
  categoria: number | null;
  stock: number;
  unidad: string;
  seccion: { id: number; nombre: string } | null;
  status: string;
}
