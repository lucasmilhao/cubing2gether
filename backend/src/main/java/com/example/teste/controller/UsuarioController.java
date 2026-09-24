package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.teste.dto.usuario.UsuarioEditRequestDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.model.Usuario;
import com.example.teste.service.UsuarioService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> getAll() {

        List<UsuarioResponseDTO> listaUsuarios = service.getTodos()
                .stream()
                .map(UsuarioResponseDTO::new)
                .toList();

        return ResponseEntity.ok(listaUsuarios);
    }

    @GetMapping("/busca")
    public ResponseEntity<List<UsuarioResponseDTO>> getUsuariosPorUsername(@RequestParam String username, @AuthenticationPrincipal Usuario u) {
        List<UsuarioResponseDTO> lista = service.getUsuarioPorUsername(username, u).stream()
                .map(UsuarioResponseDTO::new)
                .toList();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioPorUsernameExato(@PathVariable String username) {
        Usuario user = service.getUsuarioPorUsernameExato(username);
        return ResponseEntity.ok(new UsuarioResponseDTO(user));
    }

    @GetMapping("{idUsuario}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioPorId(@PathVariable String idUsuario) {
        Usuario user = service.getUsuarioId(idUsuario);
        return ResponseEntity.ok(new UsuarioResponseDTO(user));
    }

    @GetMapping("/nome/{nomeUsuario}")
    public ResponseEntity<List<UsuarioResponseDTO>> getUsuarioPorNome(@PathVariable String nomeUsuario) {
        List<UsuarioResponseDTO> lista = service.getUsuarioPorNome(nomeUsuario).stream()
                .map(UsuarioResponseDTO::new)
                .toList();

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/email/{emailUsuario}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioPorEmail(@PathVariable String emailUsuario) {
        Usuario u = service.getUsuarioPorEmail(emailUsuario);

        return ResponseEntity.ok(new UsuarioResponseDTO(u));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> getMe(
            @AuthenticationPrincipal Usuario user) {

        return ResponseEntity.ok(
                new UsuarioResponseDTO(user));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarUser(@RequestBody @Valid UsuarioRequestDTO data) {
        Usuario user = service.criarUser(data);
        return ResponseEntity.ok(new UsuarioResponseDTO(user));
    }

    @PutMapping(
            value = "{idUsuario}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UsuarioResponseDTO> editarUser(
            @PathVariable String idUsuario,
            @RequestParam("nome") String nome,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {

        UsuarioEditRequestDTO data = new UsuarioEditRequestDTO(
                idUsuario,
                nome
        );

        Usuario u = service.editarUsuario(data, file);

        return ResponseEntity.ok(new UsuarioResponseDTO(u));
    }

    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable String idUsuario) {
        service.deletarUsuario(idUsuario);
        return ResponseEntity.ok().build();
    }

}
