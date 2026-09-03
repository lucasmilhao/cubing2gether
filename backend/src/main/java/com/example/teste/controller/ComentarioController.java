package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.comentario.ComentarioRequestDTO;
import com.example.teste.dto.comentario.ComentarioResponseDTO;
import com.example.teste.model.Comentario;
import com.example.teste.service.ComentarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/comentario")
public class ComentarioController {
    
    @Autowired
    private ComentarioService service;

    @PostMapping
    public ResponseEntity<ComentarioResponseDTO> criarComentario(@RequestBody @Valid ComentarioRequestDTO request) {
        Comentario c = service.criarComentario(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ComentarioResponseDTO(c));
    }

    @GetMapping("/{idPostagem}")
    public ResponseEntity<List<ComentarioResponseDTO>> getComentarios(@PathVariable String idPostagem) {
        List<ComentarioResponseDTO> list = service.getComentariosPostagem(idPostagem).stream()
            .map(ComentarioResponseDTO::new)
            .toList();

        return ResponseEntity.ok(list);
    }

}
