package com.example.teste.dto.chat.conversa;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConversaRequestDTO(
    @NotBlank
    @Size(max = 32)
    String nome
) {
    
}
