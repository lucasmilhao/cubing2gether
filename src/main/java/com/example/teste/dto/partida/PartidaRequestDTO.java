package com.example.teste.dto.partida;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public record PartidaRequestDTO(
    @NotNull
    List<String> idsUsuarios
) {
    
}
