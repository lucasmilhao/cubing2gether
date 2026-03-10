package com.example.teste.dto.solve;

import com.example.teste.model.Usuario;

public record SolveRequestDTO(
        Long tempo,
        String scramble,
        String penalty,
        String userId
        ) {

}
