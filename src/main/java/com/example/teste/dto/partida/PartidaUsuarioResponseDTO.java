package com.example.teste.dto.partida;

import com.example.teste.model.Partida;
import com.example.teste.model.PartidaUsuario;
import com.example.teste.model.Usuario;

public record PartidaUsuarioResponseDTO(
    String idPartidaUsuario,

    Partida partida,

    Usuario usuario,

    Long media
) {

    public PartidaUsuarioResponseDTO(PartidaUsuario p) {
        this(p.getIdPartidaUsuario(), p.getPartida(), p.getUsuario(), p.getMedia());
    }
    
}
