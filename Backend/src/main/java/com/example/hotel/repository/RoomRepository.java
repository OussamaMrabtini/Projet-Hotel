package com.example.hotel.repository;

import com.example.hotel.model.Room;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findById(Long id);
} 