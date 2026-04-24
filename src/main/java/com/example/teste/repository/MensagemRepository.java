package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Mensagem;

public interface MensagemRepository extends JpaRepository<Mensagem, String> {
    
}
