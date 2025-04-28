package com.example.hotel.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long roomId;  // ✅ Simple Long ID (no @ManyToOne)

    @Column(name = "client_id", nullable = false)
    private Long clientId;  // ✅ Simple Long ID (no @ManyToOne)

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "number_of_people", nullable = false)
    private int numberOfPeople;

    @Column(name = "payment_type", nullable = false)
    private String paymentType;

    @Column(name = "total_amount", nullable = false)
    private double totalAmount;

    // Constructors
    public Reservation() {}

    public Reservation(Long id, Long roomId, Long clientId, LocalDate startDate, LocalDate endDate, 
                       int numberOfPeople, String paymentType, double totalAmount) {
        this.id = id;
        this.roomId = roomId;
        this.clientId = clientId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfPeople = numberOfPeople;
        this.paymentType = paymentType;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public int getNumberOfPeople() { return numberOfPeople; }
    public void setNumberOfPeople(int numberOfPeople) { this.numberOfPeople = numberOfPeople; }
    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
} 