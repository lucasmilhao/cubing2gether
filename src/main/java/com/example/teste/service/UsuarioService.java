package com.example.teste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    
    public Usuario criarUser(UsuarioRequestDTO data) {

        Usuario user = new Usuario(data);

        usuarioRepository.save(user);

        return user;

    }

    public Usuario getUsuarioId(String idUsuario) {
        return usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());
    }

    public Usuario editarUsuario(UsuarioRequestDTO data, String idUsuario){
        
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());

        usuario.setNome(data.nome());
        usuario.setEmail(data.email());
        usuario.setFotoPerfil(data.fotoPerfil());
    
        usuarioRepository.save(usuario);

        return usuario;

    }

}
