package com.example.teste.dto.postagem;

import java.time.Instant;

import com.example.teste.model.Postagem;
import com.example.teste.model.Scramble;
import com.example.teste.model.Usuario;

public record PostagemResponseDTO(String id, String descricao, Scramble scramble, Usuario usuario, Instant createdAt, Integer curtidas) {

    public PostagemResponseDTO(Postagem p) {
        this(p.getId(), p.getDescricao(), p.getScramble(), p.getUsuario(), p.getCreatedAt(), p.getCurtidas().size());
    }
    
}
