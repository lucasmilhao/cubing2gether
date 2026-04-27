package com.example.teste.dto.chat.participantes;

import java.time.Instant;

import com.example.teste.model.Conversa;
import com.example.teste.model.ParticipantesConversa;
import com.example.teste.model.Usuario;

public record ParticipantesConversaResponseDTO(
    String id,
    Conversa conversa,
    Usuario usuario,
    Instant entrou
) {
    public ParticipantesConversaResponseDTO(ParticipantesConversa p) {
        this(p.getId(), p.getConversa(), p.getUsuario(), p.getEntrou());
    }
    
}
