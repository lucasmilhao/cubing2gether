package com.example.teste.dto.usuario;

import com.example.teste.type.TypeProvider;

public record AuthenticatedUserDTO (
    TypeProvider provider,
    String externalId,
    String email,
    String name,
    String pictureUrl,
    boolean emailVerified
) {}