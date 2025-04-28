package com.example.hotel.model;

import jakarta.persistence.*;

@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String type; 

    @Column(nullable = false)
    private int capacity;

    @Column(name = "price_per_night", nullable = false)
    private double pricePerNight;

    @Column(columnDefinition = "TEXT")
    private String equipments; 

    public Room() {}

    public Room(Long id, String number, String type, int capacity, String equipments, double pricePerNight) {
        this.id = id;
        this.number = number;
        this.type = type;
        this.capacity = capacity;
        this.equipments = equipments;
        this.pricePerNight = pricePerNight;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getEquipments() { return equipments; }
    public void setEquipments(String equipments) { this.equipments = equipments; }
    public double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; }
} 