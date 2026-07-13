package com.example.teste.dto.solve;

public record SolveRequestDTO(
        Long tempo,
        String scramble,
        String penalty,
        String userId,
        String partidaId
        ) {

}
