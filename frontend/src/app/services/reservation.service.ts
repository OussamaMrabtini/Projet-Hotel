import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getReservationsForRoom(roomId: number | undefined, start: string, end: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/room/${roomId}`, { 
      params: { start, end } 
    });
  }

  isRoomAvailable(roomId: number | undefined, start: string, end: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/room/${roomId}/available`, { 
      params: { start, end } 
    });
  }
}