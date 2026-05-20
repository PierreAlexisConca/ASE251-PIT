import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule], // Quitamos RouterLink de aquí porque ya no se usa en el HTML
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  loginData = {
    username: '',
    password: ''
  };

  constructor(
    public loginService: LoginService,
    private router: Router
  ) {}

  onLogin() {
    console.log('Intentando conectar con Spring Boot...', this.loginData);
    
    // Le añadimos tipos (: any) a la respuesta y al error para complacer a TypeScript
    this.loginService.login(this.loginData).subscribe({
      next: (response: any) => {
        console.log('¡Login correcto!', response);
        this.router.navigate(['/dashboard']); 
      },
      error: (err: any) => {
        console.error('Error al iniciar sesión:', err);
        alert('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    });
  }
}