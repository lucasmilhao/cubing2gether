package com.example.teste.dto.usuario;

public record RedefinirSenhaRequestDTO(
        String token,
        String novaSenha
) {}