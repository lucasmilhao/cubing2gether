package com.example.teste.dto.solve;

import com.example.teste.model.Solve;
import com.example.teste.model.Usuario;

public record SolveResponseDTO(Long id, Long tempo, String scramble, String penalty, Usuario user) {

    public SolveResponseDTO(Solve data) {
        this(data.getId(), data.getTempo(), data.getScramble(), data.getPenalty(), data.getUser());
    }
    
}
