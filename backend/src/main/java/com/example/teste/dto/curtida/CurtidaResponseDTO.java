package com.example.teste.dto.curtida;

import java.time.Instant;

import com.example.teste.model.Curtida;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;

public record CurtidaResponseDTO(String id, Usuario usuario, Postagem postagem, Instant createdAt) {

    public CurtidaResponseDTO(Curtida c) {
        this(c.getId(), c.getUsuario(), c.getPostagem(), c.getCreatedAt());
    }
    
}
