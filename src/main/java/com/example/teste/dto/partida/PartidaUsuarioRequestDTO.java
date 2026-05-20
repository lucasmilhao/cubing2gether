package com.example.teste.dto.partida;

import com.example.teste.model.Partida;
import com.example.teste.model.Usuario;

public record PartidaUsuarioRequestDTO(
    Partida partida,

    Usuario usuario,
    
    Long media
) {
    
}
