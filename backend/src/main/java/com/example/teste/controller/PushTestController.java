package com.example.teste.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.teste.model.PushToken;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PushTokenRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.client.RestClient;

@RestController
@RequestMapping("/push-test")
@RequiredArgsConstructor
public class PushTestController {

    private final PushTokenRepository pushTokenRepository;

    private final RestClient client = RestClient.builder()
        .baseUrl("https://exp.host/--/api/v2/push")
        .build();

    @PostMapping
    public ResponseEntity<?> testar(
        @AuthenticationPrincipal Usuario usuario
    ) {
        if (usuario == null) {
            return ResponseEntity.status(401)
                .body(Map.of("erro", "Não autenticado"));
        }

        var tokens = pushTokenRepository
            .findByUsuarioId(usuario.getId());

        if (tokens.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "erro", "Nenhum dispositivo registrado"
                ));
        }

        for (PushToken token : tokens) {

            Map<String, Object> payload = Map.of(
                "to", token.getToken(),
                "title", "Cubing2Gether",
                "body", "Teste de notificação pelo Spring Boot!",
                "sound", "default",
                "channelId", "default",
                "data", Map.of("tipo", "TESTE")
            );

            String resposta = client.post()
                .uri("/send")
                .body(payload)
                .retrieve()
                .body(String.class);

            System.out.println(
                "Resposta do Expo: " + resposta
            );
        }

        return ResponseEntity.ok(
            Map.of("mensagem", "Envio solicitado ao Expo")
        );
    }
}