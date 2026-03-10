package com.example.teste.dto.usuario;

import com.example.teste.model.Usuario;

public record UsuarioResponseDTO(String id, String nome, String email, String fotoPerfil) {

    public UsuarioResponseDTO(Usuario data) {
        this(data.getId(), data.getNome(), data.getEmail(), data.getFotoPerfil());
    }

}
