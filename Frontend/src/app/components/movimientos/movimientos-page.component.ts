import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientosService } from '../../services/movimientos.service';
import { InventarioService } from '../../services/inventario.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { Movimiento } from '../../models/movimiento';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [AdminLayoutComponent, CommonModule, FormsModule],
  templateUrl: './movimientos-page.component.html',
  styleUrl: './movimientos-page.component.scss'
})
export class MovimientosPageComponent implements OnInit {
  movimientos: Movimiento[] = [];
  movimientosOriginales: Movimiento[] = [];
  productos: Producto[] = [];
  tipoSeleccionado: 'Entrada' | 'Salida' = 'Entrada';
  filtroActivo: string = 'todos';
  errorMovimientos: string | null = null;
  
  nuevoMovimiento: Movimiento = {
    productoId: 0,
    usuarioId: 1,
    tipo: 'Entrada',
    cantidad: 0,
    fecha: new Date().toISOString().split('T')[0],
    proveedor: '',
    documento: '',
    unidad: 'kg',
    observaciones: ''
  };

  stockActual: number = 0;

  constructor(
    private movimientosService: MovimientosService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit() {
    this.cargarMovimientos();
    this.cargarProductos();
  }

  cargarMovimientos() {
    this.errorMovimientos = null;
    this.movimientosService.getToday().subscribe({
      next: (data: Movimiento[]) => {
        this.movimientos = [...data];
        this.movimientosOriginales = [...data];
      },
      error: (err) => {
        this.movimientos = [];
        this.movimientosOriginales = [];
        this.errorMovimientos = 'No se pudieron cargar los movimientos. Intenta más tarde.';
        // Opcional: puedes loguear el error en consola para depuración
        console.error('Error al cargar movimientos:', err);
      }
    });
  }

  cargarProductos() {
    this.inventarioService.getAll().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      }
    });
  }

  cambiarTipo(tipo: 'Entrada' | 'Salida') {
    this.tipoSeleccionado = tipo;
    this.nuevoMovimiento.tipo = tipo;
  }

  onProductoChange() {
    const producto = this.productos.find((p: Producto) => p.id === this.nuevoMovimiento.productoId);
    this.stockActual = producto?.stock || 0;
  }

  registrarMovimiento() {
    if (this.nuevoMovimiento.productoId && this.nuevoMovimiento.cantidad) {
      this.movimientosService.create(this.nuevoMovimiento).subscribe({
        next: () => {
          this.cargarMovimientos();
          this.resetearFormulario();
        }
      });
    }
  }

  resetearFormulario() {
    this.nuevoMovimiento = {
      productoId: 0,
      usuarioId: 1,
      tipo: 'Entrada',
      cantidad: 0,
      fecha: new Date().toISOString().split('T')[0],
      proveedor: '',
      documento: '',
      unidad: 'kg',
      observaciones: ''
    };
    this.stockActual = 0;
  }

  setFiltro(filtro: string) {
    this.filtroActivo = filtro;
    
    if (filtro === 'todos') {
      this.movimientos = [...this.movimientosOriginales];
    } else if (filtro === 'entradas') {
      this.movimientos = this.movimientosOriginales.filter((m: Movimiento) => m.tipo === 'Entrada');
    } else if (filtro === 'salidas') {
      this.movimientos = this.movimientosOriginales.filter((m: Movimiento) => m.tipo === 'Salida');
    }
  }

  getProductoNombre(productoId: number): string {
    return this.productos.find((p: Producto) => p.id === productoId)?.nombre || 'N/A';
  }

  getProductoSkuCategoria(productoId: number): string {
    const producto = this.productos.find((p: Producto) => p.id === productoId);
     return producto ? `${producto.codigo} · ${producto.categoria?.nombre ?? ''}` : '';
  }

  formatearCantidad(cantidad: number, tipo: string): string {
    const signo = tipo === 'Entrada' ? '+ ' : '– ';
    return `${signo}${cantidad.toLocaleString()}`;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (date.toDateString() === hoy.toDateString()) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === ayer.toDateString()) {
      return `Ayer, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('es-ES');
  }

  get movimientosHoy(): number {
    return this.movimientos.length;
  }
}


