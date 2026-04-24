package com.example.teste.dto.chat.participantes;

import java.time.Instant;

public record ParticipantesConversaResponseDTO(
    String id,
    String idConversa,
    String idUsuario,
    Instant entrou
) {
    
}
