import { Routes } from '@angular/router';
import { DashboardPageComponent } from './components/dashboard/dashboard-page.component';
import { InventarioPageComponent } from './components/inventario/inventario-page.component';
import { LoginPageComponent } from './components/login/login-page.component';
import { MovimientosPageComponent } from './components/movimientos/movimientos-page.component';
import { ReportesPageComponent } from './components/reportes/reportes-page.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard] },
	{ path: 'inventario', component: InventarioPageComponent, canActivate: [authGuard] },
	{ path: 'movimientos', component: MovimientosPageComponent, canActivate: [authGuard] },
	{ path: 'reportes', component: ReportesPageComponent, canActivate: [authGuard] },
	{ path: '**', redirectTo: 'login' }
];
