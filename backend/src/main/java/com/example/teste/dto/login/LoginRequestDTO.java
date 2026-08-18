package com.example.teste.dto.login;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDTO(
        
        @Email(message = "Insira um email válido")
        @NotBlank(message = "Preencha o campo de email.")
        String email,

        @NotBlank(message = "Preencha o campo de senha.")
        @Size(
                min = 8,
                message = "Senha muito curta."
        )
        String senha
) {
}