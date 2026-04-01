package com.example.teste.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.login.LoginRequestDTO;
import com.example.teste.dto.login.LoginResponseDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.infra.security.TokenService;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> fazerLoginUsuario(@RequestBody LoginRequestDTO request) {
        Usuario user = userRepository.findByEmail(request.email()).orElseThrow(() -> new UsuarioNaoEncontradoException());

        if(passwordEncoder.matches(request.senha(), user.getSenha())) {
            String token = tokenService.generateToken(user);
            return ResponseEntity.ok(new LoginResponseDTO(new UsuarioResponseDTO(user), token));
        }

        return ResponseEntity.badRequest().build();

    }
    
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> registrarUsuario(@RequestBody UsuarioRequestDTO request) {
        Optional<Usuario> user = userRepository.findByEmail(request.email());

        if(user.isEmpty()) {
            System.out.println("dsflkasdjhfçksdajhfaslkdjfhasdlkjfh");
            Usuario usuario = new Usuario();
            usuario.setSenha(passwordEncoder.encode(request.senha()));
            usuario.setEmail(request.email());
            usuario.setNome(request.nome());
            usuario.setFotoPerfil(request.fotoPerfil());
            this.userRepository.save(usuario);
            String token = this.tokenService.generateToken(usuario);
            return ResponseEntity.ok(new LoginResponseDTO(new UsuarioResponseDTO(usuario), token));
        }


        return ResponseEntity.badRequest().build();

    }


}
