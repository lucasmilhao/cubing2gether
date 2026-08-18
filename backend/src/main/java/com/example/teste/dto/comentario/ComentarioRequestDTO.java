package com.example.teste.dto.comentario;

public record ComentarioRequestDTO(
    String idUsuario,
    String idPostagem,
    String conteudo
) {}
