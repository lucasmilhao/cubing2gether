package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.postagem.PostagemRequestDTO;
import com.example.teste.dto.postagem.PostagemResponseDTO;
import com.example.teste.model.Postagem;
import com.example.teste.service.PostagemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/postagem")
public class PostagemController {

    @Autowired
    private PostagemService service;

    @GetMapping
    public ResponseEntity<List<PostagemResponseDTO>> getTodas() {
        List<PostagemResponseDTO> lista = service.getTodasPostagens().stream()
                .map(PostagemResponseDTO::new)
                .toList();

        return ResponseEntity.ok(lista);
    }

    
    @PostMapping
    public ResponseEntity<PostagemResponseDTO> criarPostagem(@RequestBody @Valid PostagemRequestDTO request) {
        Postagem p = service.criarPostagem(request);

        return ResponseEntity.ok(new PostagemResponseDTO(p));
    }

    
    @DeleteMapping("{idPostagem}")
    public ResponseEntity<PostagemResponseDTO> deletarPostagem(@PathVariable String idPostagem) {
        service.removerPostagem(idPostagem);

        return ResponseEntity.noContent().build();
    }

    
    @PutMapping("{idPostagem}")
    public ResponseEntity<PostagemResponseDTO> editarPostagem(@PathVariable String idPostagem,
            @RequestBody @Valid PostagemRequestDTO request) {
        Postagem p = service.editarPostagem(idPostagem, request);

        return ResponseEntity.ok(new PostagemResponseDTO(p));
    }

}
