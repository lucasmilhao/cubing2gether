package com.example.teste.dto.curtida;

import jakarta.validation.constraints.NotNull;

public record CurtidaRequestDTO(
    @NotNull
    String idUsuario,

    @NotNull
    String idPostagem
) {
    
}
