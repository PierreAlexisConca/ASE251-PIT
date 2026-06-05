import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResumen } from '../models/dashboard';
import { environment } from '../../environments/environment';

export interface DashboardMovimientoReciente {
  id: number;
  tipo: string;
  cantidad: number;
  unidad: string;
  fecha: string;
  proveedor?: string;
  productoNombre: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/dashboard';

  getResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(this.apiUrl);
  }

  getMovimientosRecientes(): Observable<DashboardMovimientoReciente[]> {
    return this.http.get<DashboardMovimientoReciente[]>(`${this.apiUrl}/movimientos-recientes`);
  }
}
