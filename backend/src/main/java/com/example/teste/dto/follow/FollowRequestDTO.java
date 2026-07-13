package com.example.teste.dto.follow;

import jakarta.validation.constraints.NotNull;

public record FollowRequestDTO(
    @NotNull
    String idSeguidor,

    @NotNull
    String idSeguindo
) {
}
