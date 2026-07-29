package com.example.teste.dto.postagem;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record PostagemRequestDTO(
    @NotNull
    @NotBlank
    @NotEmpty
    String descricao,

    @Nullable
    String idScramble,

    @NotNull
    @NotBlank
    @NotEmpty
    String idUsuario

) {
    
}
