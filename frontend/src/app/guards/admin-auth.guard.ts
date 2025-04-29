// src/app/guards/admin-auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      return true;
    }
    
    this.router.navigate(['/admin-login']);
    return false;
  }
}