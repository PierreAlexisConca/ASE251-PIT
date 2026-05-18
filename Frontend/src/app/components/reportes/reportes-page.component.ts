import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
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
    this.reportesService.monthly(new Date().getFullYear()).subscribe(res => this.monthly = res);
    this.reportesService.distribution(this.from, this.to).subscribe(res => this.distribution = res);
    this.reportesService.topProducts(this.from, this.to, 5).subscribe(res => this.topProducts = res);
  }
}
