import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movimiento } from '../models/movimiento';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  
  private mockMovimientos: Movimiento[] = [
    {
      id: 1,
      productoId: 1,
      usuarioId: 1,
      tipo: 'Entrada',
      cantidad: 2400,
      fecha: new Date().toISOString(),
      proveedor: 'Proveedor Agricola Huanca',
      documento: 'G-2026-00288',
      unidad: 'kg',
      observaciones: ''
    },
    {
      id: 2,
      productoId: 2,
      usuarioId: 2,
      tipo: 'Salida',
      cantidad: 150,
      fecha: new Date().toISOString(),
      proveedor: 'Parcela N°5 - Carlos Quispe',
      documento: 'G-2026-00289',
      unidad: 'kg',
      observaciones: ''
    }
  ];

  constructor() {}

  getAll(): Observable<Movimiento[]> {
    return of(this.mockMovimientos);
  }

  getById(id: number): Observable<Movimiento | undefined> {
    return of(this.mockMovimientos.find(m => m.id === id));
  }

  create(movimiento: Movimiento): Observable<Movimiento> {
    const nuevoMovimiento = { ...movimiento, id: Date.now() };
    this.mockMovimientos.push(nuevoMovimiento);
    return of(nuevoMovimiento);
  }

  getToday(): Observable<Movimiento[]> {
    return of(this.mockMovimientos);
  }
}

