package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.teste.dto.postagem.PostagemRequestDTO;
import com.example.teste.model.Postagem;
import com.example.teste.model.Scramble;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PostagemRepository;
import com.example.teste.repository.ScrambleRepository;

@Service
public class PostagemService {
    
    @Autowired
    private PostagemRepository postagemRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ScrambleRepository scrambleRepository;

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

    public List<Postagem> getTodasPostagens() {
        return postagemRepository.findAllByOrderByCreatedAtDesc();
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
