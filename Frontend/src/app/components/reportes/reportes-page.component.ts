import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  templateUrl: './reportes-page.component.html',
  styleUrl: './reportes-page.component.scss'
})
export class ReportesPageComponent implements OnInit {
  Math = Math;
  summary: any = { totalEntradas: 0, totalSalidas: 0, saldo: 0, productosConMovimiento: 0 };
  monthly: any[] = [];
  distribution: any[] = [];
  topProducts: any[] = [];

  // default range: last 30 days
  from = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0,10);
  to = new Date().toISOString().slice(0,10);

  constructor(public reportesService: ReportesService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.reportesService.summary(this.from, this.to).subscribe(res => this.summary = res);
    this.reportesService.monthly(new Date(this.to).getFullYear()).subscribe(res => this.monthly = res);
    this.reportesService.distribution(this.from, this.to).subscribe(res => this.distribution = res);
    this.reportesService.topProducts(this.from, this.to, 5).subscribe(res => this.topProducts = res);
  }

  generateReport(): void {
    this.loadAll();
  }

  get maxMonthlyValue(): number {
    return Math.max(1, ...this.monthly.map((item) => Math.max(item.entradas || 0, item.salidas || 0)));
  }

  get periodLabel(): string {
    return `${this.from} a ${this.to}`;
  }

  exportExcel(): void {
    const rows = [
      ['Producto', 'Categoria', 'Entradas', 'Salidas', 'Saldo'],
      ...this.topProducts.map((product) => [product.nombre, product.categoria, product.entradas, product.salidas, product.saldo]),
    ];
    const csv = rows.map((row) => row.join(';')).join('\n');
    this.downloadFile(csv, `reporte-${this.from}-${this.to}.csv`, 'text/csv;charset=utf-8;');
  }

  exportPdf(): void {
    this.printReport('Guardar como PDF');
  }

  print(): void {
    this.printReport('Imprimir');
  }

  private printReport(title: string): void {
    const printWindow = window.open('', '_blank', 'width=1024,height=768');
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Reporte de almacen</h1>
          <p>Periodo: ${this.periodLabel}</p>
          <p>Total entradas: ${this.summary.totalEntradas} | Total salidas: ${this.summary.totalSalidas} | Saldo: ${this.summary.saldo}</p>
          <table>
            <thead>
              <tr><th>Producto</th><th>Categoria</th><th>Entradas</th><th>Salidas</th><th>Saldo</th></tr>
            </thead>
            <tbody>
              ${this.topProducts.map((product) => `<tr><td>${product.nombre}</td><td>${product.categoria ?? '-'}</td><td>${product.entradas}</td><td>${product.salidas}</td><td>${product.saldo}</td></tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  private downloadFile(content: string, fileName: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
