package com.example.teste.dto.comentario;

import java.time.Instant;

import com.example.teste.model.Comentario;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;

public record ComentarioResponseDTO(String id, Postagem postagem, Usuario usuario, String conteudo, Instant createdAt) {
    
    public ComentarioResponseDTO(Comentario c) {
        this(c.getId(), c.getPostagem(),c.getUsuario(), c.getConteudo(), c.getCreatedAt());
    }

}
