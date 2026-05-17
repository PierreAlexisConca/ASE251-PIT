import { Component } from '@angular/core';
import { MovimientosService } from '../../services/movimientos.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [AdminLayoutComponent],
  templateUrl: './movimientos-page.component.html',
  styleUrl: './movimientos-page.component.scss'
})
export class MovimientosPageComponent {
  constructor(public movimientosService: MovimientosService) {}
}
