package com.example.teste.service;

import org.springframework.stereotype.Service;

import com.example.teste.model.PushToken;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PushTokenRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PushTokenService {

    private final PushTokenRepository repository;

    @Transactional
    public void registrar(Usuario usuario, String token) {

        if (token == null ||
            !token.matches(
                "^(ExponentPushToken|ExpoPushToken)\\[[^\\]]+\\]$"
            )) {
            throw new IllegalArgumentException(
                "Token Expo inválido"
            );
        }

        PushToken pushToken = repository
            .findByToken(token)
            .orElseGet(PushToken::new);

        pushToken.setUsuario(usuario);
        pushToken.setToken(token);

        repository.save(pushToken);
    }

    @Transactional
    public void remover(Usuario usuario, String token) {
        repository.findByToken(token)
            .filter(t -> t.getUsuario().getId()
                .equals(usuario.getId()))
            .ifPresent(repository::delete);
    }
}