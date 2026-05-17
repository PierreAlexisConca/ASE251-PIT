import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResumen } from '../models/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/dashboard';

  getResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(this.apiUrl);
  }
}
