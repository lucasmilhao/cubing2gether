package com.example.teste.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.curtida.CurtidaRequestDTO;
import com.example.teste.model.Curtida;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;
import com.example.teste.repository.CurtidaRepository;

@Service
public class CurtidaService {
    
    @Autowired
    private CurtidaRepository curtidaRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PostagemService postagemService;

    public Curtida criarCurtida(CurtidaRequestDTO request) {
        Usuario u = usuarioService.getUsuarioId(request.idUsuario());
        Postagem p = postagemService.getPostagemId(request.idPostagem());

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

    public Boolean isPostagemCurtida(Usuario usuario, String idPostagem) {
        Postagem postagem = postagemService.getPostagemId(idPostagem);
        Optional<Curtida> c = curtidaRepository.findByUsuarioAndPostagem(usuario, postagem);

        return c.isPresent();
    }
}
