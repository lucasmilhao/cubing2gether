package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.teste.dto.postagem.PostagemRequestDTO;
import com.example.teste.model.Follow;
import com.example.teste.model.Postagem;
import com.example.teste.model.Scramble;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PostagemRepository;
import com.example.teste.repository.ScrambleRepository;
import com.example.teste.type.TypeUsuario;

@Service
public class PostagemService {
    
    @Autowired
    private PostagemRepository postagemRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ScrambleRepository scrambleRepository;

    @Autowired 
    private FollowService followService;

    public Postagem criarPostagem(PostagemRequestDTO request) {
        Usuario u = usuarioService.getUsuarioId(request.idUsuario());
        Scramble s = null;

        if(request.idScramble() != null) {
            s = scrambleRepository.findById(request.idScramble()).orElseThrow(() -> new RuntimeException("Scramble nao encontrado"));
        }

        Postagem p = new Postagem();
        p.setDescricao(request.descricao());
        p.setUsuario(u);
        p.setScramble(s);

        return postagemRepository.save(p);
    }

    public List<Postagem> getTodasPostagens(Usuario u) {
        List<Usuario> amigos = followService.getAmigos(u.getId()).stream().map(Follow::getSeguindo).toList();

        return postagemRepository.findAllByOrderByCreatedAtDesc().stream().filter(e -> {
            Boolean isAdmin = e.getUsuario().getTipo().equals(TypeUsuario.ADMIN);
            Boolean isCriador = e.getUsuario().getTipo().equals(TypeUsuario.CRIADOR);
            Boolean isAmigo = amigos.stream().filter(i -> i.getId() == e.getUsuario().getId()).toList().size() > 0;

            return isAdmin || isAmigo || isCriador;
        }).toList();
    }

    public List<Postagem> getPostagemPorUsuario(String idUsuario) {
        Usuario u = usuarioService.getUsuarioId(idUsuario);

        return postagemRepository.findByUsuario(u);
    }

    @Transactional
    public Postagem removerPostagem(String idPostagem) {
        Postagem p = postagemRepository.findById(idPostagem).orElseThrow(() -> new RuntimeException());
        
        postagemRepository.delete(p);
        
        return p;
    }

    public Postagem editarPostagem(String idPostagem, PostagemRequestDTO request) {
        Postagem p = postagemRepository.findById(idPostagem).orElseThrow(() -> new RuntimeException());
        
        Scramble s = null;
        
        if(request.idScramble() != null) {
            s = scrambleRepository.findById(request.idScramble()).orElseThrow(() -> new RuntimeException("Scramble nao encontrado"));
        }

        p.setScramble(s);
        p.setDescricao(request.descricao());

        return postagemRepository.save(p);
    }

    public Postagem getPostagemId(String idPostagem) {
        return postagemRepository.findById(idPostagem).orElseThrow(() -> new RuntimeException("Postagem não encontrada"));
    }

}
