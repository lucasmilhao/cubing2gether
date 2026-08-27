package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.chat.conversa.ConversaResponseDTO;
import com.example.teste.dto.chat.participantes.ParticipantesConversaRequestDTO;
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

    @DeleteMapping
    public ResponseEntity<Void> removerParticipante(@RequestBody ParticipantesConversaRequestDTO request) {
        service.removerParticipante(request.idConversa(), request.idUsuario());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ConversaResponseDTO>> getPorIdUsuario(@PathVariable String idUsuario) {
        List<ConversaResponseDTO> lista = service.getPorIdUsuario(idUsuario).stream()
            .map(e -> new ConversaResponseDTO(e.getConversa()))
            .toList();

        return ResponseEntity.ok(lista);
    }


}
