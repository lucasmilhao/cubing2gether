package com.example.teste.infra;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.example.teste.exception.SenhaInvalidaException;
import com.example.teste.exception.UsuarioExistenteException;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(SenhaInvalidaException.class)
    private ResponseEntity<String> senhaBadRequest(SenhaInvalidaException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(UsuarioExistenteException.class)
    private ResponseEntity<String> usuarioExistente(UsuarioExistenteException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException e,
            HttpHeaders headers,
            HttpStatusCode statusCode,
            WebRequest request
    ) {
        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach(err -> {
            errors.put(err.getField(), err.getDefaultMessage());
        });

        return ResponseEntity.badRequest().body(errors);
    }
}
