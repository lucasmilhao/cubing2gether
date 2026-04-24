package com.example.teste.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.chat.mensagem.MensagemRequestDTO;
import com.example.teste.dto.chat.mensagem.MensagemResponseDTO;
import com.example.teste.model.Mensagem;
import com.example.teste.service.MensagemService;

@CrossOrigin("http://localhost:5173")
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



}
