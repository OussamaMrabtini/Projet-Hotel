import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import { ReservationService } from '../services/reservation.service';
import { Room } from '../models/room.model';
import { Reservation } from '../models/reservation.model';
import { formatDate } from '@angular/common';

interface AvailabilityCheck {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-room-details-client',
  templateUrl: './room-details-client.component.html',
  styleUrls: ['./room-details-client.component.css']
})
export class RoomDetailsClientComponent implements OnInit {
  this_room!: Room;
  errorMessage = '';
  loading = true;
  loadingReservations = false;
  isRoomAvailable = true;
  
  // Reservation listing
  roomReservations: any[] = [];
  filterStartDate: string = '';
  filterEndDate: string = '';

  // Availability check
  showAvailabilityCheck = false;
  checkDates: AvailabilityCheck = {
    startDate: '',
    endDate: ''
  };
  availabilityChecked = false;
  isAvailable = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private roomService: RoomService, 
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadRoomDetails();
  }
  
  loadRoomDetails(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId) {
      this.roomService.getRoomById(Number(roomId)).subscribe({
        next: (data) => {
          this.this_room = data;
          this.loading = false;
          
          // Initialize default filter dates to current month
          const today = new Date();
          // Load reservations for the room
          this.loadReservations();
          
          // Check if room is currently available
          this.checkRoomAvailability();

        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = "Erreur lors de la récupération des détails de la chambre.";
          console.error('Error loading room details:', error);
        }
      });
    } else {
      this.loading = false;
      this.errorMessage = "Identifiant de chambre non valide.";
    }
  }
  
  loadReservations(): void {
    this.loadingReservations = true;
    
    // Use default dates if not specified
    const startDate = this.filterStartDate || '1900-01-01';
    const endDate = this.filterEndDate || '2100-01-01';
    
    this.reservationService.getReservationsForRoom(this.this_room.id, startDate, endDate).subscribe({
      next: (reservations) => {
        // For clients, we only show booking periods without client details
        this.roomReservations = reservations.map(res => ({
          id: res.id,
          startDate: res.startDate,
          endDate: res.endDate,
          numberOfPeople: res.numberOfPeople
        }));
        this.loadingReservations = false;
      },
      error: (error) => {
        console.error('Error fetching reservations for room:', error);
        this.loadingReservations = false;
      }
    });
  }
  
  resetReservationFilters(): void {
    const today = new Date();
    this.filterStartDate = "";
    this.filterEndDate = "";
    this.loadReservations();
  }
  
  checkRoomAvailability(): void {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    const tomorrow = formatDate(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd', 'en');
    
    this.reservationService.isRoomAvailable(this.this_room.id, today, tomorrow).subscribe({
      next: (available) => {
        this.isRoomAvailable = available;
      },
      error: (error) => {
        console.error('Error checking room availability:', error);
        // Default to available in case of error
        this.isRoomAvailable = true;
      }
    });
  }

  toggleAvailabilityCheck(): void {
    this.showAvailabilityCheck = !this.showAvailabilityCheck;
    if (!this.showAvailabilityCheck) {
      this.availabilityChecked = false;
    }
  }

  checkAvailability(): void {
    this.reservationService.isRoomAvailable(
      this.this_room.id, 
      this.checkDates.startDate, 
      this.checkDates.endDate
    ).subscribe({
      next: (available) => {
        this.isAvailable = available;
        this.availabilityChecked = true;
      },
      error: (error) => {
        console.error('Error checking room availability:', error);
        alert('Erreur lors de la vérification de disponibilité. Veuillez réessayer.');
      }
    });
  }

  getEquipmentsList(equipments: string): string[] {
    return equipments ? equipments.split(',').map(item => item.trim()) : [];
  }
}