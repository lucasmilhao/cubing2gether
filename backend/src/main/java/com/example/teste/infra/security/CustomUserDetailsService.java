package com.example.teste.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.TypeProvider;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;

@Component
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UsuarioRepository repository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario user = this.repository.findByEmail(username).orElseThrow(() -> new UsuarioNaoEncontradoException());
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getCredentials().stream().filter(e -> e.getProvider() == TypeProvider.LOCAL).toList().get(0).getPasswordHash(), new ArrayList<>());
    }
}
