package com.example.teste.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.teste.model.Notificacao;
import com.example.teste.model.PushToken;
import com.example.teste.repository.PushTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpoPushService {

    private final PushTokenRepository pushTokenRepository;

    private final RestClient restClient = RestClient.builder()
        .baseUrl("https://exp.host/--/api/v2/push")
        .build();

    public void enviar(Notificacao notificacao) {

        List<PushToken> tokens = pushTokenRepository
            .findByUsuarioId(notificacao.getUsuario().getId());

        for (PushToken token : tokens) {
            try {
                Map<String, Object> data = Map.of(
                    "tipo", notificacao.getTipo().name(),
                    "referenciaId", notificacao.getReferenciaId(),
                    "notificacaoId", notificacao.getId()
                );

                Map<String, Object> payload = Map.of(
                    "to", token.getToken(),
                    "title", notificacao.getRemetente().getNome(),
                    "body", notificacao.getMensagem(),
                    "data", data,
                    "sound", "default",
                    "channelId", "default"
                );

                restClient.post()
                    .uri("/send")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            } catch (Exception e) {
                log.error(
                    "Erro ao enviar push para token {}",
                    token.getId(),
                    e
                );
            }
        }
    }
}