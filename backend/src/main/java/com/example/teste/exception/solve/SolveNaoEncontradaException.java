package com.example.teste.exception.solve;

public class SolveNaoEncontradaException extends RuntimeException {

    public SolveNaoEncontradaException(String message) {
        super(message);
    }

    public SolveNaoEncontradaException() {
        super("Não foi possível localizar a sua solve.");
    }
    
}
