export interface Reservation {
  id?: number;       
  roomId: number;       
  clientId: number;   
  startDate: string;  
  endDate: string;
  numberOfPeople: number;
  paymentType: string;
  totalAmount: number;
}
