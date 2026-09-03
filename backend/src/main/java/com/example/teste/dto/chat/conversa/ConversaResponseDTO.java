package com.example.teste.dto.chat.conversa;

import java.time.Instant;
import java.util.List;

import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.model.Conversa;

public record ConversaResponseDTO(
    String idConversa,
    String nome,
    List<UsuarioResponseDTO> participantes,
    Boolean isPublico,
    Instant dataCriado
) {
    
    public ConversaResponseDTO(Conversa c) {
        this(c.getIdConversa(), c.getNome(), c.getParticipantes().stream().map(e -> new UsuarioResponseDTO(e.getUsuario())).toList(), c.getIsPublico(), c.getDataCriado());
    }

}
