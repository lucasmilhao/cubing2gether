package com.example.teste.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.curtida.CurtidaRequestDTO;
import com.example.teste.dto.curtida.CurtidaResponseDTO;
import com.example.teste.model.Curtida;
import com.example.teste.model.Usuario;
import com.example.teste.service.CurtidaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/curtida")
public class CurtidaController {
    
    @Autowired
    private CurtidaService service;

    @PostMapping
    public ResponseEntity<CurtidaResponseDTO> criarCurtida(@RequestBody @Valid CurtidaRequestDTO request) {
        Curtida c = service.criarCurtida(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new CurtidaResponseDTO(c));
    }

    @GetMapping("/{idPostagem}")
    public ResponseEntity<Boolean> getIsCurtido(@PathVariable String idPostagem, @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(service.isPostagemCurtida(usuario, idPostagem));
    }
}
