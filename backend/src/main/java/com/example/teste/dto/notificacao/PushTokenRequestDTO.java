package com.example.teste.dto.notificacao;

import jakarta.validation.constraints.NotNull;

public record PushTokenRequestDTO(
    @NotNull 
    String token
) {}