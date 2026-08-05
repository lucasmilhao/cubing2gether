package com.example.teste.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.curtida.CurtidaRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Curtida;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;
import com.example.teste.repository.CurtidaRepository;
import com.example.teste.repository.PostagemRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class CurtidaService {
    
    @Autowired
    private CurtidaRepository curtidaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PostagemRepository postagemRepository;

    public Curtida criarCurtida(CurtidaRequestDTO request) {
        Usuario u = usuarioRepository.findById(request.idUsuario()).orElseThrow(() -> new UsuarioNaoEncontradoException());
        Postagem p = postagemRepository.findById(request.idPostagem()).orElseThrow(() -> new RuntimeException());

        Optional<Curtida> c = curtidaRepository.findByUsuarioAndPostagem(u, p);

        if(c.isPresent()) {
            curtidaRepository.delete(c.get());
            return c.get();
        }

        Curtida curtida = new Curtida();
        curtida.setPostagem(p);
        curtida.setUsuario(u);

        return curtidaRepository.save(curtida);
    }

}
