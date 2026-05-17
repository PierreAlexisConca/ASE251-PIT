import { Routes } from '@angular/router';
import { DashboardPageComponent } from './components/dashboard/dashboard-page.component';
import { InventarioPageComponent } from './components/inventario/inventario-page.component';
import { LoginPageComponent } from './components/login/login-page.component';
import { MovimientosPageComponent } from './components/movimientos/movimientos-page.component';
import { ReportesPageComponent } from './components/reportes/reportes-page.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'dashboard', component: DashboardPageComponent },
	{ path: 'inventario', component: InventarioPageComponent },
	{ path: 'movimientos', component: MovimientosPageComponent },
	{ path: 'reportes', component: ReportesPageComponent },
	{ path: '**', redirectTo: 'login' }
];
