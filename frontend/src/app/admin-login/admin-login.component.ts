import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  password: string = '';
  errorMessage: string = '';
  private readonly ADMIN_PASSWORD = environment.adminPassword;

  constructor(private router: Router) { }

  login() {
    if (this.password === this.ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.errorMessage = 'Mot de passe incorrect';
      this.password = '';
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}