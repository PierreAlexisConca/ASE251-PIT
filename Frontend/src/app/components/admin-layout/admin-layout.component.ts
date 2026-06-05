import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models/auth-user';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  @Input() pageTitle = '';
  @Input() pagePath = '';
  @Input() active: 'dashboard' | 'inventario' | 'movimientos' | 'reportes' = 'dashboard';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  get currentUser(): AuthUser | null {
    return this.authService.getCurrentUser();
  }

  get userInitials(): string {
    const nombre = this.currentUser?.nombre?.trim();
    if (!nombre) {
      return 'PI';
    }

    return nombre
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  get formattedDate(): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
