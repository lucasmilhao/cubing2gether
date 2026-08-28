package com.example.teste.dto.conversa;

import java.time.Instant;

import com.example.teste.dto.chat.conversa.ConversaResponseDTO;

public record ConviteResponseDTO(
    String token,
    String link,
    Instant expiraEm,
    ConversaResponseDTO conversa
) {
    
}
