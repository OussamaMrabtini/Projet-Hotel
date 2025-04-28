// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { ClientHomeComponent } from './client-home/client-home.component'; // Placeholder - will update later
import { RoomDetailsClientComponent } from './room-details-client/room-details-client.component'; 

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AdminAuthGuard] 
  },
  { 
    path: 'add-room', 
    component: AddRoomComponent,
    canActivate: [AdminAuthGuard]
  },
  { path: 'room-details/:id', component: RoomDetailsComponent, canActivate:[AdminAuthGuard] }, // Route for room details
  { path: 'client-home', component: ClientHomeComponent },
  { path: 'client-home-room/:id', component: RoomDetailsClientComponent},
  { path: '**', redirectTo: '/' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }