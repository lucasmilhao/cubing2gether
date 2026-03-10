package com.example.teste.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.exception.UsuarioExistenteException;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    
    public Usuario criarUser(UsuarioRequestDTO data) {


        if(usuarioRepository.findByNome(data.nome()) != null) {
            throw new UsuarioExistenteException("Usuario com esse nome já existe");
        }

        if(usuarioRepository.findByEmail(data.email()) != null) {
            throw new UsuarioExistenteException("Email já cadastrado.");
        } 

        Usuario user =new Usuario(data);

        usuarioRepository.save(user);

        return user;

    }

}
