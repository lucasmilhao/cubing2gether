package com.example.teste.service;

import java.util.List;

import org.apache.hc.client5.http.auth.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.teste.dto.login.LoginRequestDTO;
import com.example.teste.dto.usuario.AuthenticatedUserDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.AuthenticationProvider;
import com.example.teste.model.Credential;
import com.example.teste.model.TypeProvider;
import com.example.teste.model.Usuario;
import com.example.teste.repository.CredentialRepository;
import com.example.teste.repository.UsuarioRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class LocalAuthService implements AuthenticationProvider<LoginRequestDTO> {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CredentialRepository credentialRepository;

    @Override
    public TypeProvider getProvider() {
        return TypeProvider.LOCAL;
    }

    @Override
    public AuthenticatedUserDTO authenticate(LoginRequestDTO dto) {
        Usuario u = usuarioRepository.findByEmail(dto.email()).orElseThrow(() -> new UsuarioNaoEncontradoException());
        Credential cred = u.getCredentials().stream().filter(e -> e.getProvider() == TypeProvider.LOCAL).toList().get(0);

        if(!passwordEncoder.matches(dto.senha(), cred.getPasswordHash()))    {
            throw new RuntimeException();
        }

        return new AuthenticatedUserDTO(
            getProvider(),
            u.getEmail(), 
            u.getEmail(), 
            u.getNome(), 
            u.getPicture(), 
            true
        );
    }
    
}
