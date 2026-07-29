package com.example.teste.dto.scramble;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ScrambleRequestDTO(
    @NotNull
    @NotBlank
    String scramble,

    @Nullable
    String solution
) {
    
}
