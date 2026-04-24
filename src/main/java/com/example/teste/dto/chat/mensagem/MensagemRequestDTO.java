package com.example.teste.dto.chat.mensagem;

public record MensagemRequestDTO(
    String texto,
    String idSender,
    String idConversa
) {
    
}
