package com.example.teste.dto.scramble;

import com.example.teste.model.Scramble;

public record ScrambleResponseDTO(
    String id,
    String scramble,
    String solution,
    String svg
) {
    public ScrambleResponseDTO(Scramble s) {
        this(s.getId(), s.getScramble(), s.getSolution(), s.getSvg());
    }
}
