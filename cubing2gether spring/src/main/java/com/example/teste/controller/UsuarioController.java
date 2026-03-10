package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;
import com.example.teste.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private UsuarioService service;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> getAll() {
        
        List<UsuarioResponseDTO> listaUsuarios = repository.findAll()
        .stream()
        .map(UsuarioResponseDTO::new)
        .toList();

        return ResponseEntity.ok(listaUsuarios);
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarUser(@RequestBody @Valid UsuarioRequestDTO data) {
        Usuario user = service.criarUser(data);
        return ResponseEntity.ok(new UsuarioResponseDTO(user));
    }

}
