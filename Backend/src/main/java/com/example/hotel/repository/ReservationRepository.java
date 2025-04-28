package com.example.hotel.repository;

import com.example.hotel.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByRoomIdAndEndDateGreaterThanEqualAndStartDateLessThanEqual(Long roomId, LocalDate start, LocalDate end);
} 