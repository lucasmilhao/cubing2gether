package com.example.teste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.teste.dto.login.LoginRequestDTO;
import com.example.teste.dto.usuario.AuthenticatedUserDTO;
import com.example.teste.exception.SenhaInvalidaException;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.AuthenticationProvider;
import com.example.teste.model.Credential;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;
import com.example.teste.type.TypeProvider;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class LocalAuthService implements AuthenticationProvider<LoginRequestDTO> {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public TypeProvider getProvider() {
        return TypeProvider.LOCAL;
    }

    @Override
    public AuthenticatedUserDTO authenticate(LoginRequestDTO dto) {
        Usuario u = usuarioRepository.findByEmail(dto.email()).orElseThrow(() -> new UsuarioNaoEncontradoException());
        Credential cred = u.getCredentials().stream().filter(e -> e.getProvider() == TypeProvider.LOCAL).toList().get(0);

        if(!passwordEncoder.matches(dto.senha(), cred.getPasswordHash()))    {
            throw new SenhaInvalidaException("Usuário ou senha inválidos.");
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