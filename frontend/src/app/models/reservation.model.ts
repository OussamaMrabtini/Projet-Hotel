export interface Reservation {
  id?: number;        // Optional for new reservations
  roomId: number;         // Matches Spring Boot @ManyToOne
  clientId: number;     // Matches Spring Boot @ManyToOne
  startDate: string;  // Format: "YYYY-MM-DD" (or use Date if preferred)
  endDate: string;
  numberOfPeople: number;
  paymentType: string;
  totalAmount: number;
}
