import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import {
  InventarioService,
  Product,
  ProductFormModel,
  StockStatus,
} from '../../services/inventario.service';

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

  searchTerm = '';
  selectedCategory = 'Todos';
  selectedSection = 'Todas';
  selectedStatus = 'Todos';
  activeTab = 'Todos';
  showForm = false;
  editingProductId: number | null = null;
  loading = false;
  saving = false;

  readonly categories = ['Todos', 'Granos', 'Insumos', 'Fertilizantes', 'Herramientas'];
  readonly sections = ['Todas', 'A-02', 'A-04', 'B-01', 'B-03', 'C-01', 'D-02', 'D-05'];
  readonly statuses = ['Todos', 'Normal', 'Bajo', 'Por vencer', 'Critico'];

  products: Product[] = [];

  formModel: ProductFormModel = this.emptyForm();

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.inventarioService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get filteredProducts(): Product[] {
    return this.products
      .map((product) => ({ ...product, status: this.getStatus(product) }))
      .filter((product) => this.matchesSearch(product))
      .filter((product) => this.matchesCategory(product))
      .filter((product) => this.matchesSection(product))
      .filter((product) => this.matchesStatus(product))
      .filter((product) => this.matchesTab(product));
  }

  get categoryCounts(): CategoryCounts {
    return this.products.reduce(
      (counts, product) => {
        counts[product.categoria] += 1;
        counts.Todos += 1;
        return counts;
      },
      { Todos: 0, Granos: 0, Insumos: 0, Fertilizantes: 0, Herramientas: 0 },
    );
  }

  openNewProduct(): void {
    this.editingProductId = null;
    this.formModel = this.emptyForm();
    this.showForm = true;
  }

  openEditProduct(product: Product): void {
    this.editingProductId = product.id;
    this.formModel = {
      id: product.id,
      codigo: product.codigo,
      nombre: product.nombre,
      detalle: product.detalle,
      categoria: product.categoria,
      stock: product.stock,
      unidad: product.unidad,
      seccion: product.seccion,
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveProduct(): void {
    this.saving = true;

    if (this.editingProductId === null) {
      this.inventarioService.create(this.formModel).subscribe({
        next: (created) => {
          this.products = [created, ...this.products];
          this.saving = false;
          this.closeForm();
        },
        error: () => {
          this.saving = false;
        },
      });
    } else {
      this.inventarioService.update(this.editingProductId, this.formModel).subscribe({
        next: (updated) => {
          this.products = this.products.map((product) =>
            product.id === this.editingProductId ? updated : product,
          );
          this.saving = false;
          this.closeForm();
        },
        error: () => {
          this.saving = false;
        },
      });
    }
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Eliminar "${product.nombre}"?`)) return;

    this.inventarioService.delete(product.id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== product.id);
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

  getStockClass(product: Product): string {
    const status = this.getStatus(product);

    if (status === 'Critico') return 'stock-danger';
    if (status === 'Por vencer') return 'stock-warn';
    if (status === 'Bajo') return 'stock-warn';
    return 'stock-ok';
  }

  getStatusDotClass(product: Product): string {
    const status = this.getStatus(product);

    if (status === 'Critico') return 'dot-danger';
    if (status === 'Por vencer') return 'dot-warn';
    if (status === 'Bajo') return 'dot-warn';
    return 'dot-ok';
  }

  getStatus(product: Product): StockStatus {
    if (product.stock <= 50) return 'Critico';
    if (product.stock <= 100) return 'Bajo';
    if (product.categoria === 'Fertilizantes' && product.stock <= 350) return 'Por vencer';
    return 'Normal';
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }

  private matchesSearch(product: Product): boolean {
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

  private matchesCategory(product: Product): boolean {
    return this.selectedCategory === 'Todos' || product.categoria === this.selectedCategory;
  }

  private matchesSection(product: Product): boolean {
    return this.selectedSection === 'Todas' || product.seccion === this.selectedSection;
  }

  private matchesStatus(product: Product): boolean {
    return this.selectedStatus === 'Todos' || this.getStatus(product) === this.selectedStatus;
  }

  private matchesTab(product: Product): boolean {
    return this.activeTab === 'Todos' || product.categoria === this.activeTab;
  }

  private emptyForm(): ProductFormModel {
    return {
      id: null,
      codigo: '',
      nombre: '',
      detalle: '',
      categoria: 'Granos',
      stock: 0,
      unidad: 'kg',
      seccion: 'A-02',
    };
  }
}
