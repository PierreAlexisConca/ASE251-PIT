import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../models/producto';
import { ProductoFormModel } from '../models/producto-form.model';
import { Categoria } from '../models/categoria';
import { Seccion } from '../models/seccion';


@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/productos';
  private readonly categoriasUrl = environment.apiUrl + '/api/categorias';
  private readonly seccionesUrl = environment.apiUrl + '/api/secciones';

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  create(product: ProductoFormModel): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, product);
  }

  update(id: number, product: ProductoFormModel): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriasUrl);
  }

  getSecciones(): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(this.seccionesUrl);
  }
}
