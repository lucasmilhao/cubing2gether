package com.example.teste.dto.notificacao;

import com.example.teste.type.TypeNotificacao;

public record NotificacaoRequestDTO(
    String usuarioId,
    String remetenteId,
    TypeNotificacao tipo,
    String mensagem,
    String referenciaId
) {
    
}
