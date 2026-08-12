package com.example.teste.infra;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.example.teste.dto.ErroResponseDTO;
import com.example.teste.exception.SenhaInvalidaException;
import com.example.teste.exception.UsuarioExistenteException;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.infra.security.ApiError;

@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(SenhaInvalidaException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    private ResponseEntity<ErroResponseDTO> senhaBadRequest(SenhaInvalidaException e) {
        return ResponseEntity.badRequest().body(new ErroResponseDTO(e.getMessage(), HttpStatus.BAD_REQUEST.toString()));
    }

    @ExceptionHandler(UsuarioExistenteException.class)
    private ResponseEntity<Map<String, String>> usuarioExistente(UsuarioExistenteException e) {
        return ResponseEntity.badRequest().body(e.getErros());
    }
    
    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    private ResponseEntity<ErroResponseDTO> usuarioNaoEncontrado(UsuarioNaoEncontradoException e) {
        return ResponseEntity.badRequest().body(new ErroResponseDTO(e.getMessage(), HttpStatus.BAD_REQUEST.toString()));
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

    private ResponseEntity<ApiError> buildResponseEntity(HttpStatus status, String message) {
        ApiError error = new ApiError(status.value(), status.getReasonPhrase(), message, LocalDateTime.now());
        return ResponseEntity.status(status).body(error);
    }
    
}
