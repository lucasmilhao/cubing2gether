package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Postagem;

public interface PostagemRepository extends JpaRepository<Postagem, String> {
    
}
