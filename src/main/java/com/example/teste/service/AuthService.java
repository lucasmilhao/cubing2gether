package com.example.teste.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.teste.dto.login.LoginRequestDTO;
import com.example.teste.dto.login.LoginResponseDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.exception.UsuarioExistenteException;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.infra.security.TokenService;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class AuthService {
    
    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;


    public LoginResponseDTO registrarUsuario(UsuarioRequestDTO request) {
        Optional<Usuario> uEmail = userRepository.findByEmail(request.email());
        Optional<Usuario> uNome = userRepository.findByNome(request.nome());

        Map<String, String> erros = new HashMap<>();

        if (uEmail.isPresent())  erros.put("email", "Email já cadastrado.");
        if (uNome.isPresent())  erros.put("nome", "Nome já em uso.");

        if(!erros.isEmpty()) throw new UsuarioExistenteException(erros);

        
        Usuario usuario = new Usuario();
        usuario.setSenha(passwordEncoder.encode(request.senha()));
        usuario.setEmail(request.email());
        usuario.setNome(request.nome());
        usuario.setIsGuest(false);
        usuario.setTipo("USER");
        usuario.setFotoPerfil(request.fotoPerfil());
        this.userRepository.save(usuario);
        String token = this.tokenService.generateToken(usuario);
        return new LoginResponseDTO(new UsuarioResponseDTO(usuario), token);
    }

    public LoginResponseDTO registrarConvidado() {
        Usuario u = new Usuario();
        u.setNome("guest_" + UUID.randomUUID().toString().substring(0, 6));
        u.setSenha(
            passwordEncoder.encode(UUID.randomUUID().toString())
        );
        u.setEmail("guest_" + UUID.randomUUID().toString().substring(0, 6) + "@temp.local");
        u.setIsGuest(true);
        u.setTipo("ROLE_GUEST");

        this.userRepository.save(u);

        String token = this.tokenService.generateToken(u);

        return new LoginResponseDTO(new UsuarioResponseDTO(u), token);
    }
    
    public LoginResponseDTO fazerLoginUsuario(LoginRequestDTO request) {
        Usuario user = userRepository.findByEmail(request.email()).orElseThrow(() -> new UsuarioNaoEncontradoException());

        if (passwordEncoder.matches(request.senha(), user.getSenha()) ) {
            String token = tokenService.generateToken(user);
            return new LoginResponseDTO(new UsuarioResponseDTO(user), token);
        }
        
        throw new UsuarioNaoEncontradoException();

    }
}
