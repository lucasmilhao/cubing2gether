package com.example.teste.dto.chat.conversa;

import java.time.Instant;

import com.example.teste.model.Conversa;

public record ConversaResponseDTO(
    String idConversa,
    String nome,
    Instant dataCriado
) {
    
    public ConversaResponseDTO(Conversa c) {
        this(c.getIdConversa(), c.getNome(), c.getDataCriado());
    }

}
