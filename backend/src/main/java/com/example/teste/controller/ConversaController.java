package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.chat.conversa.ConversaRequestDTO;
import com.example.teste.dto.chat.conversa.ConversaResponseDTO;
import com.example.teste.model.Conversa;
import com.example.teste.model.Usuario;
import com.example.teste.service.ConversaService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@RestController
@RequestMapping("/conversa")
public class ConversaController {
    
    @Autowired
    private ConversaService service;

    @PostMapping
    public ResponseEntity<ConversaResponseDTO> criarConversa(@RequestBody @Valid ConversaRequestDTO request) {
        Conversa c = service.criarConversa(request);
        return ResponseEntity.ok(new ConversaResponseDTO(c));
    }
    
    @PostMapping("/participantes")
    public ResponseEntity<ConversaResponseDTO> criarConversaParticipantes(@RequestBody @Valid ConversaRequestDTO request) {
        Conversa c = service.criarConversaComParticipantes(request);
        return ResponseEntity.ok(new ConversaResponseDTO(c));
    }

    @GetMapping
    public ResponseEntity<List<ConversaResponseDTO>> getMinhasConversas(@AuthenticationPrincipal Usuario u) {
        List<ConversaResponseDTO> lista = service.getConversaPorIdUsuario(u.getId())
        .stream().map(ConversaResponseDTO::new).toList();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{idConversa}")
    public ResponseEntity<ConversaResponseDTO> getConversaId(@PathVariable String idConversa) {
        Conversa c = service.getConversaPorId(idConversa);

        return ResponseEntity.ok(new ConversaResponseDTO(c));
    }
}
