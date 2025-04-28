    package com.example.hotel.model;

    import jakarta.persistence.*;

    @Entity
    @Table(name = "client")
    public class Client {
        @Id
        @Column(name = "id", nullable = false)
        private Long id;

        @Column(nullable = false)
        private String name;

        @Column(nullable = false)
        private String email;

        public Client() {}

        public Client(Long id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    } 