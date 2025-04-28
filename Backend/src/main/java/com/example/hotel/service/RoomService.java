package com.example.hotel.service;

import com.example.hotel.model.Room;
import com.example.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public List<Room> filterRooms(Double price, Integer capacity, String equipment) {
        return roomRepository.findAll().stream()
                .filter(r -> (price == null || r.getPricePerNight() <= price))
                .filter(r -> (capacity == null || r.getCapacity() >= capacity))
                .filter(r -> (equipment == null || (r.getEquipments() != null && r.getEquipments().contains(equipment))))
                .toList();
    }
} 