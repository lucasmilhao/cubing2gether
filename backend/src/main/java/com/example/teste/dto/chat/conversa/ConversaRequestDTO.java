package com.example.teste.dto.chat.conversa;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ConversaRequestDTO(
    @NotBlank
    @NotNull
    @Size(max = 50, min=1)
    String nome,
    List<String> idsUsuarios,
    Boolean isPublico
) {
    
}
