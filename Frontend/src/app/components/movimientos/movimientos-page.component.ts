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
  errorRegistro: string | null = null;
  horaSeleccionada = new Date().toISOString().slice(11, 16);
  
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
    this.errorRegistro = null;
    this.tipoSeleccionado = tipo;
    this.nuevoMovimiento.tipo = tipo;
  }

  onProductoChange() {
    this.errorRegistro = null;
    const producto = this.productos.find((p: Producto) => p.id === Number(this.nuevoMovimiento.productoId));
    this.stockActual = producto?.stock || 0;
    if (producto) {
      this.nuevoMovimiento.unidad = producto.unidad;
    }
  }

  registrarMovimiento() {
    this.errorRegistro = null;

    const productoIdNum = Number(this.nuevoMovimiento.productoId);

    if (!productoIdNum || productoIdNum === 0) {
      this.errorRegistro = 'Debes seleccionar un producto válido.';
      return;
    }

    if (!this.nuevoMovimiento.cantidad || this.nuevoMovimiento.cantidad <= 0) {
      this.errorRegistro = 'La cantidad debe ser mayor a 0.';
      return;
    }

    if (this.nuevoMovimiento.tipo === 'Salida' && this.nuevoMovimiento.cantidad > this.stockActual) {
      this.errorRegistro = `Stock insuficiente. Solo hay ${this.stockActual} unidades disponibles.`;
      return;
    }

    const payload: Movimiento = {
      ...this.nuevoMovimiento,
      productoId: productoIdNum,
      fecha: `${this.nuevoMovimiento.fecha}T${this.horaSeleccionada}:00`,
    };

    this.movimientosService.create(payload).subscribe({
      next: () => {
        this.cargarMovimientos();
        this.cargarProductos();
        this.resetearFormulario();
      },
      error: (err) => {
        console.error('Error al registrar movimiento:', err);
        if (err.error && err.error.message) {
          this.errorRegistro = err.error.message;
        } else {
          this.errorRegistro = 'No se pudo registrar el movimiento. Intente más tarde.';
        }
      }
    });
  }

  resetearFormulario() {
    this.errorRegistro = null;
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
    this.horaSeleccionada = new Date().toISOString().slice(11, 16);
    this.stockActual = 0;
  }

  setFiltro(filtro: string) {
    this.filtroActivo = filtro;
    
    if (filtro === 'todos') {
      this.movimientos = [...this.movimientosOriginales];
    } else if (filtro === 'entradas') {
      this.movimientos = this.movimientosOriginales.filter((m: Movimiento) => m.tipo.toLowerCase() === 'entrada');
    } else if (filtro === 'salidas') {
      this.movimientos = this.movimientosOriginales.filter((m: Movimiento) => m.tipo.toLowerCase() === 'salida');
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
    const signo = tipo.toLowerCase() === 'entrada' ? '+ ' : '– ';
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


