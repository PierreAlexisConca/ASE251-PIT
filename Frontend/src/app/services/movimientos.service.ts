import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Movimiento } from '../models/movimiento';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class MovimientosService {
  
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/movimientos';

  constructor() {}

  getAll(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.apiUrl);
  }

  getById(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.apiUrl}/${id}`);
  }

  create(movimiento: Movimiento): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.apiUrl, movimiento);
  }

  getToday(): Observable<Movimiento[]> {
    // Puedes ajustar el endpoint si tienes uno específico para "hoy"
    return this.http.get<Movimiento[]>(this.apiUrl);
  }
}

