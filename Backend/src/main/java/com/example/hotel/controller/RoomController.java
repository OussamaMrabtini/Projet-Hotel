package com.example.hotel.controller;

import com.example.hotel.model.Room;
import com.example.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(room -> ResponseEntity.ok(room))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomService.addRoom(room);
    }

    @GetMapping("/filter")
    public List<Room> filterRooms(@RequestParam(required = false) Double price,
                                  @RequestParam(required = false) Integer capacity,
                                  @RequestParam(required = false) String equipment) {
        return roomService.filterRooms(price, capacity, equipment);
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }
} 