package com.example.hotel.service;

import com.example.hotel.model.Reservation;
import com.example.hotel.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation addReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    public List<Reservation> getReservationsForRoomAndPeriod(Long roomId, LocalDate start, LocalDate end) {
        return reservationRepository.findByRoomIdAndEndDateGreaterThanEqualAndStartDateLessThanEqual(roomId, start, end);
    }
} 