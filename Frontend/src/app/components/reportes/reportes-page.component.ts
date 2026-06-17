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

  // default range: from Jan 1st of current year to today
  from = `${new Date().getFullYear()}-01-01`;
  to = new Date().toLocaleDateString('en-CA');

  constructor(public reportesService: ReportesService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    console.log('DEBUG Frontend loadAll: fetching data for range from=' + this.from + ', to=' + this.to);
    
    this.reportesService.summary(this.from, this.to).subscribe({
      next: res => {
        console.log('DEBUG Frontend summary response:', res);
        this.summary = res;
      },
      error: err => console.error('DEBUG Frontend summary error:', err)
    });

    const year = new Date(this.to).getFullYear();
    console.log('DEBUG Frontend monthly: fetching for year=' + year);
    this.reportesService.monthly(year).subscribe({
      next: res => {
        console.log('DEBUG Frontend monthly response:', res);
        this.monthly = res;
      },
      error: err => console.error('DEBUG Frontend monthly error:', err)
    });

    this.reportesService.distribution(this.from, this.to).subscribe({
      next: res => {
        console.log('DEBUG Frontend distribution response:', res);
        this.distribution = res;
      },
      error: err => console.error('DEBUG Frontend distribution error:', err)
    });

    this.reportesService.topProducts(this.from, this.to, 5).subscribe({
      next: res => {
        console.log('DEBUG Frontend topProducts response:', res);
        this.topProducts = res;
      },
      error: err => console.error('DEBUG Frontend topProducts error:', err)
    });
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
