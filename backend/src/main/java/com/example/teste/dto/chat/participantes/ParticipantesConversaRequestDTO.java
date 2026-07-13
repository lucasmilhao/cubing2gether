package com.example.teste.dto.chat.participantes;

import java.time.Instant;

public record ParticipantesConversaRequestDTO(
    String idConversa,
    String idUsuario,
    Instant entrou
) {
    
}
