import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError} from 'rxjs/operators';

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
    this.filteredRooms = this.rooms.filter(room => {
      if (this.searchTerm && 
          !room.number.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          !room.equipments?.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      if (this.selectedType && this.selectedType !== 'Tous les types' && 
          room.type.toLowerCase() !== this.selectedType.toLowerCase()) {
        return false;
      }
      
      if (this.minPrice !== null && room.pricePerNight < this.minPrice) {
        return false;
      }
      if (this.maxPrice !== null && room.pricePerNight > this.maxPrice) {
        return false;
      }
      
      if (this.minCapacity !== null && room.capacity < this.minCapacity) {
        return false;
      }
      
      return true;
    });
    
    if (this.startDate) {
      if (this.endDate) {
        const availabilityChecks = this.filteredRooms.map(room => 
          this.reservationService.isRoomAvailable(room.id!, this.startDate, this.endDate).pipe(
            catchError(() => of(false)) // Handle errors by assuming room is not available
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
      else if (this.endDate ==''){
        const availabilityChecks = this.filteredRooms.map(room => 
          this.reservationService.isRoomAvailable(room.id!, this.startDate, "2200-01-01").pipe(
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

  deleteRoom(roomId: number | undefined): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      this.roomService.deleteRoom(roomId).subscribe({
        next: () => {
          this.loadRooms();
        },
        error: (error) => {
          console.error('Error deleting room:', error);
        }
      });
    }
  }

}