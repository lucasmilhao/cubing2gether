package com.example.teste.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.teste.dto.login.LoginRequestDTO;
import com.example.teste.dto.login.LoginResponseDTO;
import com.example.teste.dto.usuario.AuthenticatedUserDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.exception.UsuarioExistenteException;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.infra.security.TokenService;
import com.example.teste.model.AuthenticationProvider;
import com.example.teste.model.Credential;
import com.example.teste.model.TypeProvider;
import com.example.teste.model.Usuario;
import com.example.teste.repository.CredentialRepository;
import com.example.teste.repository.UsuarioRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final CredentialRepository credentialRepository;

    private final AuthenticationProviderFactory providerFactory;

    private final PasswordEncoder passwordEncoder;

    private final TokenService tokenService;

    private final UsuarioRepository userRepository;

    public <T> LoginResponseDTO login(
            TypeProvider provider,
            T credential) {

        AuthenticationProvider<T> authenticationProvider = providerFactory.get(provider);

        AuthenticatedUserDTO authenticated = authenticationProvider.authenticate(credential);

        Usuario usuario = buscarOuCriarUsuario(authenticated);

        String token = tokenService.generateToken(usuario);

        return new LoginResponseDTO(
                new UsuarioResponseDTO(usuario),
                token);
    }

    
    public LoginResponseDTO registrarUsuario(UsuarioRequestDTO request) {
        Optional<Usuario> uEmail = userRepository.findByEmail(request.email());
        Optional<Usuario> uNome = userRepository.findByNome(request.nome());

        Map<String, String> erros = new HashMap<>();

        if (uEmail.isPresent())  erros.put("email", "Email já cadastrado.");
        if (uNome.isPresent())  erros.put("nome", "Nome já em uso.");

        if(!erros.isEmpty()) throw new UsuarioExistenteException(erros);

        
        Usuario u = new Usuario();
        u.setEmail(request.email());
        u.setNome(request.nome());
        u.setIsGuest(false);
        u.setTipo("USER");
        
        Credential cred = new Credential();
        cred.setExternalId(u.getEmail());
        cred.setProvider(TypeProvider.LOCAL);
        cred.setPasswordHash(passwordEncoder.encode(request.senha()));
        cred.setUsuario(u);
        
        userRepository.save(u);
        credentialRepository.save(cred);
        
        String token = tokenService.generateToken(u);
        return new LoginResponseDTO(new UsuarioResponseDTO(u), token);
    }

    public Usuario buscarOuCriarUsuario(AuthenticatedUserDTO dto) {

        Optional<Credential> cred = credentialRepository.findByProviderAndExternalId(
                dto.provider(),
                dto.externalId());

        if (cred.isPresent()) {
            return cred.get().getUsuario();
        }

        Usuario usuario = usuarioRepository
                .findByEmail(dto.email())
                .orElse(null);

        if (usuario == null) {
            usuario = criarUsuario(dto);
        }

        criarCredential(usuario, dto);

        return usuario;
    }

    private Credential criarCredential(
            Usuario usuario,
            AuthenticatedUserDTO authenticated) {

        Credential credential = new Credential();

        credential.setUsuario(usuario);

        credential.setProvider(authenticated.provider());

        credential.setExternalId(authenticated.externalId());

        if(authenticated.provider() == TypeProvider.LOCAL) {
            credential.setPasswordHash("");
        }

        credentialRepository.save(credential);

        return credential;
    }

    private Usuario criarUsuario(
            AuthenticatedUserDTO authenticated) {

        Usuario usuario = new Usuario();

        usuario.setNome(authenticated.name());

        usuario.setEmail(authenticated.email());

        usuario.setPicture(authenticated.pictureUrl());

        usuarioRepository.save(usuario);

        return usuario;
    }
}