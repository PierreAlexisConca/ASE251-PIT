import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Category = 'Granos' | 'Insumos' | 'Fertilizantes' | 'Herramientas';
export type StockStatus = 'Normal' | 'Bajo' | 'Por vencer' | 'Critico';

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  detalle: string;
  categoria: Category;
  stock: number;
  unidad: string;
  seccion: string;
  status?: StockStatus;
}

export interface ProductFormModel {
  id: number | null;
  codigo: string;
  nombre: string;
  detalle: string;
  categoria: Category;
  stock: number;
  unidad: string;
  seccion: string;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/productos';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: ProductFormModel): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, product: ProductFormModel): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
