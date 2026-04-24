package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Conversa;

public interface ConversaRepository extends JpaRepository<Conversa, String>{
    
}
