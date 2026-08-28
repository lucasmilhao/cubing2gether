package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.chat.conversa.ConversaRequestDTO;
import com.example.teste.dto.chat.conversa.ConversaResponseDTO;
import com.example.teste.dto.chat.participantes.ParticipantesConversaRequestDTO;
import com.example.teste.dto.conversa.ConviteResponseDTO;
import com.example.teste.model.Conversa;
import com.example.teste.model.ConviteConversa;
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
        return ResponseEntity.status(HttpStatus.CREATED).body(new ConversaResponseDTO(c));
    }

    @PostMapping("/participantes")
    public ResponseEntity<ConversaResponseDTO> criarConversaParticipantes(
            @RequestBody @Valid ConversaRequestDTO request) {
        Conversa c = service.criarConversaComParticipantes(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ConversaResponseDTO(c));
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

    @PostMapping("/{idConversa}/convite")
    public ResponseEntity<ConviteResponseDTO> criarConvite(@PathVariable String idConversa,
            @AuthenticationPrincipal Usuario usuario) {

        ConviteConversa convite = service.criarConvite(idConversa, usuario.getId());

        String link = "http://localhost:5173/conversa/convite/" + convite.getToken();

        return ResponseEntity.ok(new ConviteResponseDTO(convite.getToken(), link, convite.getExpiraEm()));
    }

    @PutMapping("/{idConversa}")
    public ResponseEntity<ConversaResponseDTO> editarConversa(@PathVariable String idConversa, @RequestBody ConversaRequestDTO request) {
        Conversa c = service.editarConversa(idConversa, request);

        return ResponseEntity.ok(new ConversaResponseDTO(c));
    }
    
    @GetMapping("/token/{token}")
    public ResponseEntity<ConversaResponseDTO> getConversaPorConvite(@PathVariable String token) {
        Conversa c = service.getConversaPorConvite(token);
        
        return ResponseEntity.ok(new ConversaResponseDTO(c));
    }

    @DeleteMapping
    public ResponseEntity<Void> removerParticipante(@RequestBody ParticipantesConversaRequestDTO request) {
        service.removerParticipante(request.idConversa(), request.idUsuario());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/convite/{token}")
    public ResponseEntity<ConversaResponseDTO> aceitarConvite(@PathVariable String token,
            @AuthenticationPrincipal Usuario usuario) {
        Conversa c = service.aceitarConvite(token, usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ConversaResponseDTO(c));
    }
}
