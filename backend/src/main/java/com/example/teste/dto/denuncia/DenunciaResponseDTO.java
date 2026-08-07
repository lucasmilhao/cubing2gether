package com.example.teste.dto.denuncia;

import java.time.Instant;

import com.example.teste.model.Denuncia;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;

public record DenunciaResponseDTO(String id, Usuario usuario, Postagem postagem, Instant createdAt) {
    
    public DenunciaResponseDTO(Denuncia d) {
        this(d.getId(), d.getUsuario(), d.getPostagem(), d.getCreatedAt());
    }

}
