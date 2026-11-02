package com.example.teste.infra.notificacao;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.example.teste.dto.notificacao.NotificacaoCriadaEvent;
import com.example.teste.repository.NotificacaoRepository;
import com.example.teste.service.ExpoPushService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificacaoPushListener {

    private final NotificacaoRepository repository;
    private final ExpoPushService expoPushService;

    @Async
    @TransactionalEventListener(
        phase = TransactionPhase.AFTER_COMMIT
    )
    public void processar(NotificacaoCriadaEvent event) {

        repository.findById(event.notificacaoId())
            .ifPresent(expoPushService::enviar);
    }
}