package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.postagem.PostagemRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Postagem;
import com.example.teste.model.Scramble;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PostagemRepository;
import com.example.teste.repository.ScrambleRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class PostagemService {
    
    @Autowired
    private PostagemRepository postagemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ScrambleRepository scrambleRepository;

    @Autowired
    private ScrambleService scrambleService;

    public Postagem criarPostagem(PostagemRequestDTO request) {
        Usuario u = usuarioRepository.findById(request.idUsuario()).orElseThrow(() -> new UsuarioNaoEncontradoException());
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
        return postagemRepository.findAll();
    }

}
