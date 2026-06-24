import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { ProductoFormModel } from '../../models/producto-form.model';
import { StockStatus } from '../../models/stock-status';

interface CategoryCounts {
  Todos: number;
  Granos: number;
  Insumos: number;
  Fertilizantes: number;
  Herramientas: number;
}

@Component({
  selector: 'app-inventario-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  templateUrl: './inventario-page.component.html',
  styleUrl: './inventario-page.component.scss',
})
export class InventarioPageComponent implements OnInit {
  private readonly inventarioService = inject(InventarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  selectedCategory = 'Todos';
  selectedSection = 'Todas';
  selectedStatus = 'Todos';
  activeTab = 'Todos';
  showForm = false;
  editingProductId: number | null = null;
  loading = false;
  saving = false;

  readonly categories = [
    'Todos',
    'GRANO',
    'INSUMO',
    'FERTILIZANTE',
    'HERRAMIENTA',
    'MAQUINARIA AGRÍCOLA',
    'SEMILLAS CERTIFICADAS',
    'PLAGUICIDAS ORGÁNICOS',
    'FUNGICIDAS ESPECIALES',
    'HERBICIDAS SELECTIVOS',
    'BIOESTIMULANTES FOLIARES',
    'MEJORADORES DE SUELO',
    'EQUIPOS DE RIEGO',
  ];
  readonly sections = ['Todas', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
  readonly statuses = ['Todos', 'ACTIVO', 'INACTIVO'];
  readonly statusOptions = ['ACTIVO', 'INACTIVO'];

  products: Producto[] = [];

  private readonly categoryIds: { [key: string]: number } = {
    GRANO: 1,
    INSUMO: 2,
    FERTILIZANTE: 3,
    HERRAMIENTA: 4,
    'MAQUINARIA AGRÍCOLA': 5,
    'SEMILLAS CERTIFICADAS': 6,
    'PLAGUICIDAS ORGÁNICOS': 7,
    'FUNGICIDAS ESPECIALES': 8,
    'HERBICIDAS SELECTIVOS': 9,
    'BIOESTIMULANTES FOLIARES': 10,
    'MEJORADORES DE SUELO': 11,
    'EQUIPOS DE RIEGO': 12,
  };

  private readonly categoryNames: { [key: number]: string } = {
    1: 'GRANO',
    2: 'INSUMO',
    3: 'FERTILIZANTE',
    4: 'HERRAMIENTA',
    5: 'MAQUINARIA AGRÍCOLA',
    6: 'SEMILLAS CERTIFICADAS',
    7: 'PLAGUICIDAS ORGÁNICOS',
    8: 'FUNGICIDAS ESPECIALES',
    9: 'HERBICIDAS SELECTIVOS',
    10: 'BIOESTIMULANTES FOLIARES',
    11: 'MEJORADORES DE SUELO',
    12: 'EQUIPOS DE RIEGO',
  };

  private readonly sectionIds: { [key: string]: number } = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
  };

  private readonly sectionNames: { [key: number]: string } = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
  };

  formModel: ProductoFormModel = this.emptyForm();

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.inventarioService.getAll().subscribe({
      next: (data) => {
        this.products = data.map((product: any) => {
          const catId =
            product.categoria?.id ||
            product.categoriaId ||
            (product.id === this.editingProductId
              ? this.categoryIds[String(this.formModel.categoria).toUpperCase()]
              : null);
          const secId = product.seccion?.id || product.seccionId;

          return {
            ...product,
            categoria: catId ? { id: catId, nombre: this.categoryNames[catId] || '-' } : null,
            seccion: secId ? { id: secId, nombre: this.sectionNames[secId] || '-' } : null,
            status: product.status || 'ACTIVO',
          };
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get filteredProducts(): Producto[] {
    return this.products
      .filter((product) => this.matchesSearch(product))
      .filter((product) => this.matchesCategory(product))
      .filter((product) => this.matchesSection(product))
      .filter((product) => this.matchesStatus(product))
      .filter((product) => this.matchesTab(product));
  }

  get categoryCounts(): CategoryCounts {
    return this.products.reduce(
      (counts, product) => {
        const catName = product.categoria?.nombre as keyof CategoryCounts;
        if (catName && catName in counts) {
          counts[catName] += 1;
        }
        counts.Todos += 1;
        return counts;
      },
      { Todos: 0, Granos: 0, Insumos: 0, Fertilizantes: 0, Herramientas: 0 },
    );
  }

  openNewProduct(): void {
    this.editingProductId = null;
    this.formModel = this.emptyForm();

    const maxNum = this.products.reduce((max, p) => {
      const match = p.codigo?.match(/L-AG(\d{3})-\d{2}/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    this.formModel.codigo = `L-AG${String(maxNum + 1).padStart(3, '0')}-01`;

    this.showForm = true;
  }

  openEditProduct(product: Producto): void {
    this.editingProductId = product.id;
    this.formModel = {
      id: product.id,
      codigo: product.codigo,
      nombre: product.nombre,
      detalle: product.detalle,
      categoria: (product.categoria?.nombre ?? null) as any, // Pasa el texto actual al select
      stock: product.stock,
      unidad: product.unidad,
      seccion: (product.seccion?.nombre ?? null) as any, // Pasa el texto actual al select
      status: product.status || 'ACTIVO',
    };
    this.showForm = true;
  }
  closeForm(): void {
    this.showForm = false;
  }

  saveProduct(): void {
    this.saving = true;

    // 1. Capturamos los textos del formulario
    const categoriaForm = this.formModel.categoria ? String(this.formModel.categoria).trim() : '';
    const seccionForm = this.formModel.seccion ? String(this.formModel.seccion).trim() : '';

    // 2. Buscamos los IDs numéricos correspondientes en tus mapas
    const categoriaIdEncontrado = this.categoryIds[categoriaForm.toUpperCase()] || null;
    const seccionIdEncontrado = this.sectionIds[seccionForm.toUpperCase()] || null;

    // 3. ¡AQUÍ ESTÁ EL TRUCO!: Armamos la estructura de objetos anidados idéntica a tu ProductoDTO
    const body = {
      id: this.formModel.id,
      codigo: this.formModel.codigo,
      nombre: this.formModel.nombre,
      detalle: this.formModel.detalle,
      stock: this.formModel.stock,
      unidad: this.formModel.unidad,
      status: this.formModel.status,
      // En lugar de enviar un número plano, enviamos el objeto que pide Java
      categoria: categoriaIdEncontrado
        ? { id: categoriaIdEncontrado, nombre: categoriaForm }
        : null,
      seccion: seccionIdEncontrado ? { id: seccionIdEncontrado, nombre: seccionForm } : null,
    };

    // Imprimimos el objeto en consola para que verifiques que vaya perfecto
    console.log('--- ENVIANDO A PRODUCTO_DTO ---');
    console.log(body);

    const onComplete = () => {
      this.saving = false;
      this.closeForm();
      this.loadProducts(); // Recarga la tabla
    };

    if (this.editingProductId === null) {
      this.inventarioService.create(body as any).subscribe({
        next: onComplete,
        error: () => {
          this.saving = false;
        },
      });
    } else {
      this.inventarioService.update(this.editingProductId, body as any).subscribe({
        next: onComplete,
        error: () => {
          this.saving = false;
        },
      });
    }
  }

  deleteProduct(product: Producto): void {
    if (!confirm(`Eliminar "${product.nombre}"?`)) return;

    this.inventarioService.delete(product.id).subscribe({
      next: () => {
        this.products = this.products.map((p) =>
          p.id === product.id ? { ...p, status: 'INACTIVO' } : p,
        );
        this.cdr.detectChanges();
      },
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.selectedCategory = tab;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'Todos';
    this.selectedSection = 'Todas';
    this.selectedStatus = 'Todos';
    this.activeTab = 'Todos';
  }

  getStockClass(product: Producto): string {
    const status = this.getStatus(product);

    if (status === 'Critico') return 'stock-danger';
    if (status === 'Por vencer') return 'stock-warn';
    if (status === 'Bajo') return 'stock-warn';
    return 'stock-ok';
  }

  getStatusDotClass(product: Producto): string {
    const status = this.getStatus(product);

    if (status === 'Critico') return 'dot-danger';
    if (status === 'Por vencer') return 'dot-warn';
    if (status === 'Bajo') return 'dot-warn';
    return 'dot-ok';
  }

  getStatus(product: Producto): StockStatus {
    if (product.stock <= 50) return 'Critico';
    if (product.stock <= 100) return 'Bajo';
    if (product.categoria?.nombre === 'Fertilizantes' && product.stock <= 350) return 'Por vencer';
    return 'Normal';
  }

  trackByProductId(_: number, product: Producto): number {
    return product.id;
  }

  private matchesSearch(product: Producto): boolean {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return true;
    }

    return [
      product.codigo,
      product.nombre,
      product.detalle,
      product.categoria,
      product.seccion,
      product.unidad,
    ]
      .join(' ')
      .toLowerCase()
      .includes(term);
  }

  private matchesCategory(product: Producto): boolean {
    return this.selectedCategory === 'Todos' || product.categoria?.nombre === this.selectedCategory;
  }

  private matchesSection(product: Producto): boolean {
    return this.selectedSection === 'Todas' || product.seccion?.nombre === this.selectedSection;
  }

  private matchesStatus(product: Producto): boolean {
    return this.selectedStatus === 'Todos' || product.status === this.selectedStatus;
  }

  private matchesTab(product: Producto): boolean {
    return this.activeTab === 'Todos' || product.categoria?.nombre === this.activeTab;
  }

  private emptyForm(): ProductoFormModel {
    return {
      id: null,
      codigo: '',
      nombre: '',
      detalle: '',
      categoria: null,
      stock: 0,
      unidad: 'kg',
      seccion: null,
      status: 'ACTIVO',
    };
  }
}
