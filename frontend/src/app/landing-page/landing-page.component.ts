import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  constructor(private router: Router) { }

  navigateToClient() {
    // This will navigate to the client home page when implemented
    this.router.navigate(['/client-home']);
  }

  navigateToAdmin() {
    // This will navigate to the admin login page when implemented
    this.router.navigate(['/admin-login']);
  }
}