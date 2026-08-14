package com.example.teste.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.TokenRedefinicaoSenha;

public interface TokenRedefinicaoSenhaRepository
        extends JpaRepository<TokenRedefinicaoSenha, String> {

    Optional<TokenRedefinicaoSenha> findByToken(String token);
}