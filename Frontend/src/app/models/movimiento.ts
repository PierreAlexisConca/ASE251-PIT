export interface Movimiento {
  id?: number;
  productoId: number;
  usuarioId: number;
  tipo: 'Entrada' | 'Salida';
  cantidad: number;
  fecha: string;
  nota?: string;
  proveedor: string;
  documento: string;
  unidad: string;
  seccion?: string;
  observaciones?: string;
}

export interface MovimientoResponse extends Movimiento {
  productoNombre?: string;
  usuarioNombre?: string;
}
