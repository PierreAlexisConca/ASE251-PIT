import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl + '/api/reportes';

  summary(from: string, to: string): Observable<any> {
    return this.http.get<any>(`${this.base}/summary`, { params: { from, to } });
  }

  monthly(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/monthly`, { params: { year: String(year) } });
  }

  distribution(from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/distribution`, { params: { from, to } });
  }

  topProducts(from: string, to: string, limit = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/top-products`, { params: { from, to, limit: String(limit) } });
  }
}