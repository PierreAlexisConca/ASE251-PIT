import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class LoginService {
  private URL_API = environment.apiUrl + '/api/usuarios';

  constructor(private http: HttpClient) {}

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.URL_API}/login`, credenciales);
  }
}