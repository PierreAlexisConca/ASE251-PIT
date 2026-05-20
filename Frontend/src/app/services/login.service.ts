import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importamos el cliente HTTP
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Reemplaza el puerto (8080) por el puerto donde corra tu Spring Boot
  private URL_API = 'http://localhost:8080/api/auth'; 

  // Inyectamos HttpClient en el constructor para poder hacer peticiones a Java
  constructor(private http: HttpClient) {}

  /**
   * Método para enviar las credenciales del formulario a Spring Boot
   * @param credenciales Objeto que contiene { username, password }
   */
  login(credenciales: any): Observable<any> {
    // Hace un POST a http://localhost:8080/api/auth/login enviando el usuario y contraseña
    return this.http.post(`${this.URL_API}/login`, credenciales);
  }

  // Aquí podrás agregar más adelante tu método de logout si lo necesitas:
  // logout() { ... }
}