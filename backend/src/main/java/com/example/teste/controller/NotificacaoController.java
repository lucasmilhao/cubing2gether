package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.notificacao.NotificacaoRequestDTO;
import com.example.teste.dto.notificacao.NotificacaoResponseDTO;
import com.example.teste.model.Notificacao;
import com.example.teste.model.Usuario;
import com.example.teste.service.NotificacaoService;

@RestController
@RequestMapping("/notificacao")
public class NotificacaoController {
    
    @Autowired
    private NotificacaoService service;

    @PostMapping
    public ResponseEntity<NotificacaoResponseDTO> criarNotificacao(@RequestBody NotificacaoRequestDTO request) {
        Notificacao n = service.criarNotificacao(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new NotificacaoResponseDTO(n));
    }

    @GetMapping
    public ResponseEntity<List<NotificacaoResponseDTO>> getMinhasNotificacoes(@AuthenticationPrincipal Usuario u) {
        List<NotificacaoResponseDTO> lista = service.getNotificacaoUsuario(u).stream()
            .map(NotificacaoResponseDTO::new)
            .toList();

        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{idNotificacao}")
    public ResponseEntity<Void> setNotificacaoLida(@PathVariable String idNotificacao) {
        service.setNotificacaoLida(idNotificacao);
        
        return ResponseEntity.noContent().build();
    }

}
