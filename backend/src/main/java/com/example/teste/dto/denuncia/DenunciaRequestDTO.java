package com.example.teste.dto.denuncia;

import jakarta.validation.constraints.NotNull;

public record DenunciaRequestDTO(
    @NotNull
    String idUsuario,

    String idPostagem
) {
    
}
