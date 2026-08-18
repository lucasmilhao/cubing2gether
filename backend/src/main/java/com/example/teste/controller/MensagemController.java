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

import com.example.teste.dto.chat.mensagem.MensagemRequestDTO;
import com.example.teste.dto.chat.mensagem.MensagemResponseDTO;
import com.example.teste.model.Mensagem;
import com.example.teste.model.Usuario;
import com.example.teste.service.MensagemService;

@CrossOrigin("*")
@RestController
@RequestMapping("/mensagens")
public class MensagemController {
    
    @Autowired
    private MensagemService service;

    @PostMapping
    public ResponseEntity<MensagemResponseDTO> enviarMensagem(@RequestBody MensagemRequestDTO request) {
        Mensagem m = service.criarMensagem(request);

        return ResponseEntity.ok(new MensagemResponseDTO(m));
    }

    @GetMapping("/{idConversa}")
    public ResponseEntity<List<MensagemResponseDTO>> getMensagensConversa(@PathVariable String idConversa, @AuthenticationPrincipal Usuario usuarioLogado) {
        List<MensagemResponseDTO> listaMensagens = service.getMensagensConversa(idConversa, usuarioLogado).stream()
        .map(MensagemResponseDTO::new).toList();

        return ResponseEntity.ok(listaMensagens);
    }
}
