package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Arquivo;

public interface ArquivoRepository extends JpaRepository<Arquivo, String>{
    
}
