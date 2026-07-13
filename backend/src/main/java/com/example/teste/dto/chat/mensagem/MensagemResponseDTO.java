package com.example.teste.dto.chat.mensagem;

import java.time.Instant;

import com.example.teste.model.Conversa;
import com.example.teste.model.Mensagem;
import com.example.teste.model.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;

public record MensagemResponseDTO(
    String id,
    String texto,   
    Usuario sender,
    @JsonIgnore
    Conversa conversa,
    Boolean isVisto,
    Instant mandado
) {
    
    public MensagemResponseDTO(Mensagem m) {
        this(m.getIdMensagem(), m.getTexto(), m.getSender(), m.getConversa(), m.getIsVisto(), m.getMandado());
    }

}
