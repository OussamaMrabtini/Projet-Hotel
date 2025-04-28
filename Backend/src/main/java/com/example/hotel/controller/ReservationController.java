package com.example.hotel.controller;

import com.example.hotel.model.Reservation;
import com.example.hotel.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PostMapping
    public Reservation addReservation(@RequestBody Reservation reservation) {
        return reservationService.addReservation(reservation);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }

    @GetMapping("/room/{roomId}")
    public List<Reservation> getReservationsForRoomAndPeriod(@PathVariable Long roomId,
                                                            @RequestParam String start,
                                                            @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return reservationService.getReservationsForRoomAndPeriod(roomId, startDate, endDate);
    }

    @GetMapping("/room/{roomId}/available")
    public boolean isRoomAvailable(@PathVariable Long roomId,
                                   @RequestParam String start,
                                   @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        // Si la liste n'est pas vide, la chambre est réservée au moins un jour dans la période
        boolean reserved = !reservationService.getReservationsForRoomAndPeriod(roomId, startDate, endDate).isEmpty();
        return !reserved;
    }
} 