package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.example.teste.dto.usuario.UsuarioEditRequestDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired 
    private UploadService uploadService;
    
    public Usuario criarUser(UsuarioRequestDTO data) {

        Usuario user = new Usuario(data);

        usuarioRepository.save(user);

        return user;

    }

    public List<Usuario> getTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario getUsuarioId(String idUsuario) {
        return usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());
    }

    public List<Usuario> getUsuarioPorNome(String nomeUsuario) {
        return usuarioRepository.findByNomeContainingOrEmailContaining(nomeUsuario, nomeUsuario);
    }

    public Usuario getUsuarioPorEmail(String emailUsuario) {
        return usuarioRepository.findByEmail(emailUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());
    }

    public Usuario editarUsuario(UsuarioEditRequestDTO data, MultipartFile file){
        
        Usuario usuario = usuarioRepository.findById(data.id()).orElseThrow(() -> new UsuarioNaoEncontradoException());

        System.out.println("O USUARIO MUDOU DE NOME SIM SIM SIM MUDOU SIM AGORA O NOVO NOME É " + data.nome() + " POR FAVOR OQ ESTPA ACONTECENTDO");

        if(file != null) {
            String url = uploadService.subirArquivo(file);
            usuario.setPicture(url);
        }

        usuario.setNome(data.nome());
    
        usuarioRepository.save(usuario);

        return usuario;

    }

}
