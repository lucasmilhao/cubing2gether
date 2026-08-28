package com.example.teste.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.ConviteConversa;

public interface ConviteRepository extends JpaRepository<ConviteConversa, String>{
    Optional<ConviteConversa> findByToken(String token);
}
