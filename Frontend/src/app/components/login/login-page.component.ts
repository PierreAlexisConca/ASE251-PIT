import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  constructor(public loginService: LoginService) {}
}
