package com.example.teste.dto.scramble;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ScrambleRequestDTO(
    @Nullable
    String scramble,

    @NotNull
    @NotBlank
    String solution
) {
    
}
