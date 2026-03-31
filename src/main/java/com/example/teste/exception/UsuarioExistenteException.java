package com.example.teste.exception;

public class UsuarioExistenteException extends RuntimeException {
    
    public UsuarioExistenteException(String message){
        super(message);
    }

    public UsuarioExistenteException() {
        super("Usuario já existe.");
    }
}
