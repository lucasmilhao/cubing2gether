package com.example.teste.dto.login;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDTO(

        @Schema(
                description = "E-mail utilizado para autenticação",
                example = "lucas@email.com"
        )
        @Email(message = "Insira um email válido")
        @NotBlank(message = "Preencha o campo de email.")
        String email,

        @Schema(
                description = "Senha do usuário",
                example = "minhaSenha123"
        )
        @NotBlank(message = "Preencha o campo de senha.")
        @Size(
                min = 8,
                message = "Senha muito curta."
        )
        String senha
) {
}