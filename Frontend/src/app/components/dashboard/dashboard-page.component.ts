import { Component, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { DashboardResumen } from '../../models/dashboard';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [AdminLayoutComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  resumen = signal<DashboardResumen | null>(null);
  loading = signal(false);

  constructor(public dashboardService: DashboardService) {}

  ngOnInit() {
    this.loading.set(true);
    this.dashboardService.getResumen().subscribe({
      next: (data) => {
        this.resumen.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
