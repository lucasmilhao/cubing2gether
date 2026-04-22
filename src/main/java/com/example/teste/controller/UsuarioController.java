package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;
import com.example.teste.service.UsuarioService;

import jakarta.validation.Valid;

@CrossOrigin("http://localhost:5173")
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

    @GetMapping("{idUsuario}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioPorId(@PathVariable String idUsuario) {
        Usuario user = service.getUsuarioId(idUsuario);
        return ResponseEntity.ok(new UsuarioResponseDTO(user));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> getMe(@AuthenticationPrincipal Usuario user) {
        return ResponseEntity.ok(new UsuarioResponseDTO(user));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarUser(@RequestBody @Valid UsuarioRequestDTO data) {
        Usuario user = service.criarUser(data);
        return ResponseEntity.ok(new UsuarioResponseDTO(user));
    }

    @PutMapping("{idUsuario}")
    public ResponseEntity<UsuarioResponseDTO> editarUser(@RequestBody UsuarioRequestDTO data, @PathVariable String idUsuario) {
        Usuario u = service.editarUsuario(data, idUsuario);

        return ResponseEntity.ok(new UsuarioResponseDTO(u));
    }

}
