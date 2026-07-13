package com.example.teste.dto.follow;

import com.example.teste.model.Follow;
import com.example.teste.model.Usuario;

public record FollowResponseDTO(String id, Usuario seguidor, Usuario seguindo) {
    
    public FollowResponseDTO(Follow f) {
        this(f.getId(), f.getSeguidor(), f.getSeguindo());
    }

}
