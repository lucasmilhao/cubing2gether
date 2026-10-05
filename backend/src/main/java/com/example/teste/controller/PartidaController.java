package com.example.teste.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.partida.PartidaRequestDTO;
import com.example.teste.dto.partida.PartidaResponseDTO;
import com.example.teste.model.Partida;
import com.example.teste.service.PartidaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/partida")
@RequiredArgsConstructor 
public class PartidaController {
    
    private final PartidaService service;


    @PostMapping
    public ResponseEntity<PartidaResponseDTO> criarPartida(@RequestBody PartidaRequestDTO request) {
        Partida p = service.criarPartidaComParticipantes(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new PartidaResponseDTO(p));
    }

    @GetMapping
    public ResponseEntity<List<PartidaResponseDTO>> getTodos() {
        List<PartidaResponseDTO> lista = service.getTodas().stream().map(PartidaResponseDTO::new).toList();

        return ResponseEntity.ok().body(lista);
    }
}
