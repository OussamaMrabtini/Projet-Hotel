// src/app/guards/admin-auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    // Check if admin is logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      return true;
    }
    
    // Not logged in, redirect to login page
    this.router.navigate(['/admin-login']);
    return false;
  }
}