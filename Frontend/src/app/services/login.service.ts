import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUser } from '../models/auth-user';
@Injectable({ providedIn: 'root' })
export class LoginService {
  private URL_API = environment.apiUrl + '/api/usuarios';

  constructor(private http: HttpClient) {}

  login(credenciales: { username: string; password: string }): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.URL_API}/login`, credenciales);
  }
}