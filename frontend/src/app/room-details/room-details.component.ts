import { Component, OnInit, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import { ReservationService } from '../services/reservation.service';
import { ClientService } from '../services/client.service';
import { Room } from '../models/room.model';
import { Client } from '../models/client.model';
import { Reservation } from '../models/reservation.model';
import { formatDate } from '@angular/common';



export interface ReservationForm {
  clientId: number;
  clientName: string;
  clientEmail: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  paymentType: string;
}

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {
  this_room!: Room;
  errorMessage = '';
  loading = true;
  loadingReservations = false;
  isRoomAvailable = true;

  reservation: Reservation | null = null;
  reservationId: number | null = null;
  reservationStartDate: string = '';
  reservationEndDate: string = '';
  reservationNumberOfPeople: number = 1;
  reservationPaymentType: string = '';
  reservationTotalAmount: number = 0;
  
  roomReservations: any[] = [];
  filterStartDate: string = '';
  filterEndDate: string = '';

  clients: Client[] = [];
  loadingClients = false;
  
  showAddReservationForm = false;
  newReservation: ReservationForm = {
    clientId: 0,
    clientName: '',
    clientEmail: '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    paymentType: ''
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private roomService: RoomService, 
    private reservationService: ReservationService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadRoomDetails();
    this.loadClientsDetails();
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
          
          const today = new Date();
          
          this.loadReservations();
          
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
    
    const startDate = this.filterStartDate || '1900-01-01';
    const endDate = this.filterEndDate || '2100-01-01';
    
    this.reservationService.getReservationsForRoom(this.this_room.id, startDate, endDate).subscribe({
      next: (reservations) => {
        this.roomReservations = reservations;
        this.loadingReservations = false;
      },
      error: (error) => {
        console.error('Error fetching reservations for room:', error);
        this.loadingReservations = false;
      }
    });
  }

  loadClientsDetails (): void {
    this.loadingClients = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loadingClients = false;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
        this.loadingClients = false;
      }
    });
  }

  getClientIdByReservationId(reservationId: number): number {
    const reservation = this.roomReservations.find(r => r.id === reservationId);
    return reservation ? reservation.clientId : 0;
  }

  getClientNameById(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Client inconnu';
  }
  getClientEmailById(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.email : 'Email inconnu';
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
        this.isRoomAvailable = true;
      }
    });
  }

  
  toggleAddReservationForm(): void {
    this.showAddReservationForm = !this.showAddReservationForm;
    
    if (this.showAddReservationForm) {
      const today = new Date();
      this.newReservation = {
        clientId: 0,
        clientName: '',
        clientEmail: '',
        startDate: formatDate(today, 'yyyy-MM-dd', 'en'),
        endDate: formatDate(new Date(today.setDate(today.getDate() + 1)), 'yyyy-MM-dd', 'en'),
        numberOfPeople: 1,
        paymentType: ''
      };
    }
  }

    checkClientNameId(): boolean {
      const client = this.clients.find(c => c.id === this.newReservation.clientId);
      if (client) {
        if (client.name !== this.newReservation.clientName) {
          alert('Le nom du client ne correspond pas à l\'identifiant du client enregistré.');
          return false;
        }
      }
      return true;
    }
  
  addReservation(): void {
    if (new Date(this.newReservation.startDate) >= new Date(this.newReservation.endDate)) {
      alert('La date de début doit être antérieure à la date de fin.');
      return;
    }

    this.reservationService.isRoomAvailable(this.this_room.id, this.newReservation.startDate, this.newReservation.endDate)
      .subscribe({
        next: (available) => {
          console.log('Room availability:', available);
          if (!available) {
            alert('La chambre n\'est pas disponible pour les dates sélectionnées.');
            return;
          }
          
          this.createReservation();
        },
        error: (error) => {
          console.error('Error checking room availability:', error);
          alert('Erreur lors de la vérification de disponibilité. Veuillez réessayer.');
        }
      });
  }

  checkClientIdName(): boolean {
    const client = this.clients.find(c => c.id === this.newReservation.clientId);
    if (client) {
      if (client.name !== this.newReservation.clientName) {
        return false;
      }
    }
    return true;
  }
  private createReservation(): void {
    if (!this.checkClientIdName()) {
      alert('Le nom du client ne correspond pas à l\'identifiant du client enregistré.');
      return;
    }
    const newClient: Client = {
      id: this.newReservation.clientId,
      name: this.newReservation.clientName,
      email: this.newReservation.clientEmail
    };
    
    this.clientService.addClient(newClient).subscribe({
      next: (client) => {
        const startDate = new Date(this.newReservation.startDate);
        const endDate = new Date(this.newReservation.endDate);
        const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const totalAmount = days * this.this_room.pricePerNight;
        
        const reservationData: Reservation = {
          roomId: this.this_room.id || 0,
          clientId: client.id || 0,
          startDate: this.newReservation.startDate,
          endDate: this.newReservation.endDate,
          numberOfPeople: this.newReservation.numberOfPeople,
          paymentType: this.newReservation.paymentType,
          totalAmount: totalAmount
        };
        
        this.reservationService.addReservation(reservationData).subscribe({
          next: () => {
            alert('Réservation créée avec succès !');
            this.showAddReservationForm = false;
            this.loadReservations();
            this.checkRoomAvailability();
          },
          error: (error) => {
            console.error('Error creating reservation:', error);
            alert('Erreur lors de la création de la réservation. Veuillez réessayer.');
          }
        });
      },
      error: (error) => {
        console.error('Error creating/updating client:', error);
        alert('Erreur lors de la création du client. Veuillez réessayer.');
      }
    });
  }
  
  confirmCancelReservation(reservationId: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.deleteReservation(reservationId).subscribe({
        next: () => {
          alert('Réservation annulée avec succès !');
          this.loadReservations();
          this.checkRoomAvailability();
        },
        error: (error) => {
          console.error('Error canceling reservation:', error);
          alert('Erreur lors de l\'annulation de la réservation. Veuillez réessayer.');
        }
      });
    }
  }

  getEquipmentsList(equipments: string): string[] {
    return equipments ? equipments.split(',').map(item => item.trim()) : [];
  }

  deleteRoom(roomId: number | undefined): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      this.roomService.deleteRoom(roomId).subscribe({
        next: () => {
          alert('Chambre supprimée avec succès !');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (error) => {
          console.error('Error deleting room:', error);
        }
      });
    }
  }
}