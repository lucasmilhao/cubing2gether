package com.example.teste.dto.solve;

import org.worldcubeassociation.tnoodle.scrambles.PuzzleRegistry;

import com.example.teste.model.Partida;
import com.example.teste.model.Solve;
import com.example.teste.model.Usuario;

public record SolveResponseDTO(Long id, Long tempo, String scramble, PuzzleRegistry tipoCubo,String penalty, Usuario user, Partida partida) {

    public SolveResponseDTO(Solve data) {
        this(data.getId(), data.getTempo(), data.getScramble(), data.getTypeCubo(),data.getPenalty(), data.getUser(), data.getPartida());
    }
    
}
