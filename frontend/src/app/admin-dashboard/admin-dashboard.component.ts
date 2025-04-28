// src/app/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RoomService} from '../services/room.service';
import { Room } from '../models/room.model';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
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
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/']);
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
    this.startDate = '';
    this.endDate = '';
    this.filteredRooms = [...this.rooms];
  }

  getEquipmentsList(equipments: string): string[] {
    return equipments ? equipments.split(',').map(item => item.trim()) : [];
  }
  
  // Method to filter rooms using the backend service
  // This is an alternative approach using the backend filtering endpoint
  filterRoomsWithBackend(): void {
    // We can use the backend filtering endpoint when appropriate
    this.roomService.filterRooms(
      this.maxPrice || undefined,
      this.minCapacity || undefined,
      this.searchTerm || undefined
    ).subscribe({
      next: (filteredRooms: Room[]) => {
        this.filteredRooms = filteredRooms;
        
        // Further filter by type if needed (as the backend doesn't support this)
        if (this.selectedType && this.selectedType !== 'Tous les types') {
          this.filteredRooms = this.filteredRooms.filter(room => 
            room.type.toLowerCase() === this.selectedType.toLowerCase()
          );
        }
        
        // Check availability if dates are provided
        if (this.startDate && this.endDate) {
          this.checkAvailabilityForFilteredRooms();
        }
      },
      error: (error) => {
        console.error('Error filtering rooms:', error);
      }
    });
  }
  
  // Helper method to check availability for currently filtered rooms
  private checkAvailabilityForFilteredRooms(): void {
    const availabilityChecks = this.filteredRooms.map(room => 
      this.reservationService.isRoomAvailable(room.id!, this.startDate, this.endDate).pipe(
        catchError(() => of(false))
      )
    );
    
    if (availabilityChecks.length > 0) {
      forkJoin(availabilityChecks).subscribe({
        next: (results) => {
          this.filteredRooms = this.filteredRooms.filter((room, index) => results[index]);
        },
        error: (error) => {
          console.error('Error checking room availability:', error);
        }
      });
    }
  }

  // Method to navigate to the add room page
  addRoom(): void {
    this.router.navigate(['/add-room']);
  }
  
  viewRoomDetails(roomId: number | undefined): void {
    if (roomId !== undefined) {
      console.log(`Navigating to room details for room ID: ${roomId}`);
      this.router.navigate([`/room-details/${roomId}`]);
    } else {
      console.error("Room ID is undefined. Cannot navigate.");
    }
  }

  deleteRoom(roomId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      this.roomService.deleteRoom(roomId).subscribe({
        next: () => {
          this.loadRooms(); // Reload rooms after deletion
        },
        error: (error) => {
          console.error('Error deleting room:', error);
        }
      });
    }
  }

}