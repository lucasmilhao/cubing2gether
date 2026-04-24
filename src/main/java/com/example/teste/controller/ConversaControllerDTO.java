package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.chat.conversa.ConversaRequestDTO;
import com.example.teste.dto.chat.conversa.ConversaResponseDTO;
import com.example.teste.model.Conversa;
import com.example.teste.service.ConversaService;

@RestController
@RequestMapping("/conversa")
public class ConversaControllerDTO {
    
    @Autowired
    private ConversaService service;

    @PostMapping
    public ResponseEntity<ConversaResponseDTO> criarConversa(@RequestBody ConversaRequestDTO request) {
        Conversa c = service.criarConversa(request);
        return ResponseEntity.ok(new ConversaResponseDTO(c));
    }
    
    @PostMapping("/participantes")
    public ResponseEntity<ConversaResponseDTO> criarConversaParticipantes(@RequestBody ConversaRequestDTO request, List<String> idsUsuarios) {
        Conversa c = service.criarConversaComParticipantes(request, idsUsuarios);
        return ResponseEntity.ok(new ConversaResponseDTO(c));
    }
}
