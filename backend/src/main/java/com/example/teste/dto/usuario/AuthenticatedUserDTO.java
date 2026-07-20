package com.example.teste.dto.usuario;

import com.example.teste.model.TypeProvider;

public record AuthenticatedUserDTO (
    TypeProvider provider,
    String externalId,
    String email,
    String name,
    String pictureUrl,
    boolean emailVerified
) {}