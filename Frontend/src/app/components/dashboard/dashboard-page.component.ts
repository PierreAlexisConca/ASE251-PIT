import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DashboardService, DashboardMovimientoReciente } from '../../services/dashboard.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { DashboardResumen } from '../../models/dashboard';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { Seccion } from '../../models/seccion';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [AdminLayoutComponent, CommonModule, RouterLink, DecimalPipe, DatePipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  resumen = signal<DashboardResumen | null>(null);
  movimientosRecientes = signal<DashboardMovimientoReciente[]>([]);
  alertas = signal<string[]>([]);
  capacidades = signal<Array<{ nombre: string; porcentaje: number; stock: number; capacidad: number }>>([]);
  loading = signal(false);

  constructor(
    public dashboardService: DashboardService,
    private readonly inventarioService: InventarioService,
  ) {}

  ngOnInit() {
    this.loading.set(true);
    forkJoin({
      resumen: this.dashboardService.getResumen(),
      movimientos: this.dashboardService.getMovimientosRecientes(),
      productos: this.inventarioService.getAll(),
      secciones: this.inventarioService.getSecciones(),
    }).subscribe({
      next: ({ resumen, movimientos, productos, secciones }) => {
        this.resumen.set(resumen);
        this.movimientosRecientes.set(movimientos);
        this.alertas.set(this.buildAlertas(productos));
        this.capacidades.set(this.buildCapacidades(productos, secciones));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private buildAlertas(productos: Producto[]): string[] {
    return productos
      .filter((product) => product.stock <= 100)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 3)
      .map((product) => `${product.nombre}: ${product.stock} ${product.unidad} disponibles en ${product.seccion?.nombre ?? 'sin seccion'}`);
  }

  private buildCapacidades(
    productos: Producto[],
    secciones: Seccion[],
  ): Array<{ nombre: string; porcentaje: number; stock: number; capacidad: number }> {
    return secciones
      .map((seccion) => {
        const stock = productos
          .filter((producto) => producto.seccion?.id === seccion.id)
          .reduce((total, producto) => total + producto.stock, 0);
        const capacidad = seccion.capacidad ?? 0;
        const porcentaje = capacidad > 0 ? Math.min(100, Math.round((stock / capacidad) * 100)) : 0;
        return {
          nombre: seccion.nombre,
          porcentaje,
          stock,
          capacidad,
        };
      })
      .filter((seccion) => seccion.capacidad > 0)
      .sort((a, b) => b.porcentaje - a.porcentaje)
      .slice(0, 3);
  }
}
