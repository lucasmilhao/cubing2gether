package com.example.teste.infra.security;

import java.time.LocalDateTime;

public record ApiError(
    int status,
    String error,
    String message,
    LocalDateTime timestamp
){}
