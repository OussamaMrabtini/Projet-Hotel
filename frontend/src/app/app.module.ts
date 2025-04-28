// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { RouterModule } from '@angular/router';


// Import our services
import { RoomService } from './services/room.service';
import { ClientService } from './services/client.service';
import { ReservationService } from './services/reservation.service';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { ClientHomeComponent } from './client-home/client-home.component';
import { RoomDetailsClientComponent } from './room-details-client/room-details-client.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AddRoomComponent,
    RoomDetailsComponent,
    ClientHomeComponent,
    RoomDetailsClientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule
  ],
  providers: [
    RoomService,
    ClientService,
    ReservationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }