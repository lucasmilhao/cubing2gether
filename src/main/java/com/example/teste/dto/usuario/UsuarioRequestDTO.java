package com.example.teste.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(

    @NotBlank(message="Preencha o campo de nome.")
    String nome, 

    @Email(message="Insira um email válido")
    @NotBlank(message="Preencha o campo de email.")
    String email, 
    
    @NotBlank(message="Preencha o campo de senha.")
    @Size(min=8, message="Senha muito curta.")
    String senha, 

    String fotoPerfil) {
    
}
