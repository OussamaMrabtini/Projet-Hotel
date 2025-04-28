// src/app/client-home/client-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RoomService } from '../services/room.service';
import { Room } from '../models/room.model';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  
  // Filter variables
  searchTerm: string = '';
  selectedType: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minCapacity: number | null = null;
  startDate: string = '';
  endDate: string = '';

  types: string[] = ['Simple', 'Double', 'Suite'];
  
  constructor(
    private roomService: RoomService,
    private reservationService: ReservationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.filteredRooms = [...this.rooms];
        this.applyFilter(); // Apply filter with default dates
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      }
    });
  }

  applyFilter(): void {
    // First apply all local filters
    this.filteredRooms = this.rooms.filter(room => {
      // Filter by search term (number or equipment)
      if (this.searchTerm && 
          !room.number.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          !room.equipments?.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by type
      if (this.selectedType && this.selectedType !== 'Tous les types' && 
          room.type.toLowerCase() !== this.selectedType.toLowerCase()) {
        return false;
      }
      
      // Filter by price range
      if (this.minPrice !== null && room.pricePerNight < this.minPrice) {
        return false;
      }
      if (this.maxPrice !== null && room.pricePerNight > this.maxPrice) {
        return false;
      }
      
      // Filter by capacity
      if (this.minCapacity !== null && room.capacity < this.minCapacity) {
        return false;
      }
      
      return true;
    });
    
    // If dates are selected, check availability with server
    if (this.startDate) {
      if (this.endDate) {
        // Create an array of availability check observables
        const availabilityChecks = this.filteredRooms.map(room => 
          this.reservationService.isRoomAvailable(room.id!, this.startDate, this.endDate).pipe(
            catchError(() => of(false)) // Handle errors by assuming room is not available
          )
        );
        
        // Use forkJoin to wait for all availability checks to complete
        if (availabilityChecks.length > 0) {
          forkJoin(availabilityChecks).subscribe({
            next: (results) => {
              // Filter rooms based on availability results
              this.filteredRooms = this.filteredRooms.filter((room, index) => results[index]);
            },
            error: (error) => {
              console.error('Error checking room availability:', error);
            }
          });
        }
      }
      else if (this.endDate ==''){
        // Create an array of availability check observables
        const availabilityChecks = this.filteredRooms.map(room => 
          this.reservationService.isRoomAvailable(room.id!, this.startDate, "2200-01-01").pipe(
            catchError(() => of(false)) // Handle errors by assuming room is not available
          )
        );
        
        // Use forkJoin to wait for all availability checks to complete
        if (availabilityChecks.length > 0) {
          forkJoin(availabilityChecks).subscribe({
            next: (results) => {
              // Filter rooms based on availability results
              this.filteredRooms = this.filteredRooms.filter((room, index) => results[index]);
            },
            error: (error) => {
              console.error('Error checking room availability:', error);
            }
          });
        }
      }
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minCapacity = null;
    
    // Reset to today and tomorrow
    const today = new Date();
    this.startDate = today.toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.endDate = tomorrow.toISOString().split('T')[0];
    
    this.filteredRooms = [...this.rooms];
    this.applyFilter(); // Apply filter with reset dates
  }

  getEquipmentsList(equipments: string): string[] {
    return equipments ? equipments.split(',').map(item => item.trim()) : [];
  }
  
  viewRoomDetails(roomId: number | undefined): void {
    if (roomId !== undefined) {
      this.router.navigate([`/client-home-room/${roomId}`], { 
        queryParams: { 
          startDate: this.startDate, 
          endDate: this.endDate 
        } 
      });
    }
  }
}