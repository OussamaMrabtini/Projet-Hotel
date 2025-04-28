import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room.model';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {
  room: Room = {
    number: '',
    type: '',
    capacity: 1,
    pricePerNight: 0,
    equipments: ''
  };

  roomTypes: string[] = ['Simple', 'Double', 'Suite'];
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  equipmentsText = ''; // User input from the textarea

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {}

  /**
   * Updates the room.equipments field based on the user's input.
   * Ensures proper formatting (trim spaces and remove empty values).
   */
  updateEquipments(): void {
    const formattedEquipments = this.equipmentsText
      .split(',')
      .map(equip => equip.trim())
      .filter(equip => equip.length > 0); // Remove empty values

    this.room.equipments = formattedEquipments.join(', '); // Store in string format
  }

  addRoom(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Ensure the equipments field is properly formatted
    this.updateEquipments();

    this.roomService.addRoom(this.room).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.successMessage = `La chambre ${result.number} a été ajoutée avec succès!`;

        // Reset form
        this.room = {
          number: '',
          type: '',
          capacity: 1,
          pricePerNight: 0,
          equipments: ''
        };
        this.equipmentsText = '';

        setTimeout(() => {
          this.router.navigate(['/admin-dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = `Erreur lors de l'ajout de la chambre: ${error.message || 'Veuillez réessayer'}`;
        console.error('Error adding room:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}