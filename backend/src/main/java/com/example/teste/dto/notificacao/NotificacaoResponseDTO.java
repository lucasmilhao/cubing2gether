package com.example.teste.dto.notificacao;

import java.time.Instant;

import com.example.teste.model.Notificacao;
import com.example.teste.model.Usuario;
import com.example.teste.type.TypeNotificacao;

public record NotificacaoResponseDTO(
    String id,
    Usuario usuario,
    Usuario remetente,
    TypeNotificacao tipo,
    String mensagem,
    Boolean isLida,
    Instant createdAt,
    String referenciaId
) {
    
    public NotificacaoResponseDTO(Notificacao n) {
        this(n.getId(), n.getUsuario(), n.getRemetente(), n.getTipo(), n.getMensagem(), n.getIsLida(), n.getCreatedAt(), n.getReferenciaId());
    }

}
