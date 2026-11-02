package com.example.teste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.PushToken;

public interface PushTokenRepository extends JpaRepository<PushToken, String> {

    Optional<PushToken> findByToken(String token);

    List<PushToken> findByUsuarioId(String usuarioId);

    void deleteByToken(String token);
}