import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models/auth-user';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loading = false;
  errorMessage = '';

  loginData = {
    username: '',
    password: ''
  };

  constructor(
    public loginService: LoginService,
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.loading = true;
    this.errorMessage = '';

    this.loginService.login(this.loginData).subscribe({
      next: (response: AuthUser) => {
        this.authService.setCurrentUser(response);
        this.loading = false;
        this.router.navigate(['/dashboard']); 
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
      }
    });
  }
}