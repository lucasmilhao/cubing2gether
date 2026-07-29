package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Scramble;

public interface ScrambleRepository extends JpaRepository<Scramble, String> {
    
}
