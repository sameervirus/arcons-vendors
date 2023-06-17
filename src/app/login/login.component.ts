import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };
  errorMessage: any;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {} // Inject the AuthService

  onLoginSubmit() {
    this.errorMessage = undefined;
    this.isLoading = true;
    this.authService
      .login(this.loginData.username, this.loginData.password)
      .subscribe({
        next: (v) => {
          localStorage.setItem('token', v.token);
          this.router.navigate(['/home']);
        },
        error: (e) => {
          this.errorMessage = e.error.error;
          console.error(e);
          this.isLoading = false;
        },
      });
  }
}
