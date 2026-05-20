package com.example.teste.dto.partida;

import java.time.Instant;

import com.example.teste.model.Partida;

public record PartidaResponseDTO(
    String idPartida,

    Long duracao,

    Instant data
) {
    
    public PartidaResponseDTO(Partida p) {
        this(p.getIdPartida(), p.getDuracao(), p.getData());
    }

}
