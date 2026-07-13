package com.example.teste.exception;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioExistenteException extends RuntimeException{
    private Map<String, String> erros;

    public UsuarioExistenteException(String message) {
        super(message);
    }

    public UsuarioExistenteException() {
        super("Usuário já existe.");
    }

    public UsuarioExistenteException(Map<String, String> erros) {
        super("Usuário já existe.");
        this.erros = erros;
    }


}
