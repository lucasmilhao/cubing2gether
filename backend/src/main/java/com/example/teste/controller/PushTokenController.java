package com.example.teste.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.notificacao.PushTokenRequestDTO;
import com.example.teste.model.Usuario;
import com.example.teste.service.PushTokenService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/push-token")
@RequiredArgsConstructor
public class PushTokenController {

    private final PushTokenService service;

    @PostMapping
    public ResponseEntity<Void> registrar(
        @AuthenticationPrincipal Usuario usuario,
        @RequestBody PushTokenRequestDTO request
    ) {
        service.registrar(usuario, request.token());

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> remover(
        @AuthenticationPrincipal Usuario usuario,
        @RequestBody PushTokenRequestDTO request
    ) {
        service.remover(usuario, request.token());

        return ResponseEntity.noContent().build();
    }
}