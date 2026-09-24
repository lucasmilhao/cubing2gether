package com.example.teste.dto.usuario;

import com.example.teste.model.Usuario;
import com.example.teste.type.TypeUsuario;

public record UsuarioResponseDTO(String id, String nome, String email, TypeUsuario tipo, Boolean isGuest, String picture, String username) {

    public UsuarioResponseDTO(Usuario data) {
        this(data.getId(), data.getNome(), data.getEmail(), data.getTipo(), data.getIsGuest(), data.getPicture(), data.getUsername());
    }

}
