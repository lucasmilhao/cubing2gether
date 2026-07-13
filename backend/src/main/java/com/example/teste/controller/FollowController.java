package com.example.teste.controller;

import java.util.List;

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

import com.example.teste.dto.follow.FollowRequestDTO;
import com.example.teste.dto.follow.FollowResponseDTO;
import com.example.teste.dto.follow.FollowStatusDTO;
import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.model.Follow;
import com.example.teste.model.Usuario;
import com.example.teste.service.FollowService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/follow")
public class FollowController {
    
    @Autowired
    private FollowService service;

    @PostMapping
    public ResponseEntity<FollowResponseDTO> criarFollow(@RequestBody @Valid FollowRequestDTO request) {
        Follow f = service.criarFollow(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new FollowResponseDTO(f));
    }

    @GetMapping("/seguindo/{idUsuario}")
    public ResponseEntity<List<FollowResponseDTO>> getSeguindo(@PathVariable String idUsuario) {
        List<FollowResponseDTO> lista = service.getSeguindo(idUsuario).stream()
            .map(FollowResponseDTO::new)
            .toList();

        return ResponseEntity.ok(lista);
    }
    
    @GetMapping("/seguidores/{idUsuario}")
    public ResponseEntity<List<FollowResponseDTO>> getSeguidores(@PathVariable String idUsuario) {
        List<FollowResponseDTO> lista = service.getSeguidores(idUsuario).stream()
            .map(FollowResponseDTO::new)
            .toList();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/status/{idUsuario}")
    public ResponseEntity<FollowStatusDTO> getStatus(@AuthenticationPrincipal Usuario u, @PathVariable String idUsuario) {
        return ResponseEntity.ok(service.getStatus(u, idUsuario));
    }

    @GetMapping("/amigos")
    public ResponseEntity<List<UsuarioResponseDTO>> getAmigos(@AuthenticationPrincipal Usuario u) {
        List<UsuarioResponseDTO> lista = service.getAmigos(u.getId()).stream()
            .map(Follow::getSeguindo)
            .map(UsuarioResponseDTO::new)
            .toList();

        return ResponseEntity.ok(lista);
    }
}
