package com.example.teste.dto.conversa;

import java.time.Instant;

public record ConviteResponseDTO(
    String token,
    String link,
    Instant expiraEm
) {
    
}
