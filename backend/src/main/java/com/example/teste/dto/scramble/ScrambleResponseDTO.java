package com.example.teste.dto.scramble;

public record ScrambleResponseDTO(
    String id,
    String scramble,
    String solution,
    String svg
) {
}
