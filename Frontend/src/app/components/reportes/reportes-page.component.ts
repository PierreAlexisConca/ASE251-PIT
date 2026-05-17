import { Component } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [AdminLayoutComponent],
  templateUrl: './reportes-page.component.html',
  styleUrl: './reportes-page.component.scss'
})
export class ReportesPageComponent {
  constructor(public reportesService: ReportesService) {}
}
