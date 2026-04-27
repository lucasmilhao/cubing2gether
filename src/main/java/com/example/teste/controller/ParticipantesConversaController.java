package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.chat.participantes.ParticipantesConversaResponseDTO;
import com.example.teste.service.ParticipantesConversaService;

@RestController
@RequestMapping("/participantes")
public class ParticipantesConversaController {
    
    @Autowired
    private ParticipantesConversaService service;

    @GetMapping
    public ResponseEntity<List<ParticipantesConversaResponseDTO>> getAll() {
        List<ParticipantesConversaResponseDTO> lista = service.getTodos()
        .stream().map(ParticipantesConversaResponseDTO::new).toList();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{idConversa}")
    public ResponseEntity<List<ParticipantesConversaResponseDTO>> getPorId(@PathVariable String idConversa) {
        List<ParticipantesConversaResponseDTO> lista = service.getTodosPorConversa(idConversa)
        .stream().map(ParticipantesConversaResponseDTO::new).toList();

        return ResponseEntity.ok(lista);
    }

}
