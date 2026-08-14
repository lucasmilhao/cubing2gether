package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.notificacao.NotificacaoRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Notificacao;
import com.example.teste.model.Usuario;
import com.example.teste.repository.NotificacaoRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class NotificacaoService {
    
    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Notificacao criarNotificacao(NotificacaoRequestDTO request) {

        Usuario usuario = usuarioRepository.findById(request.usuarioId()).orElseThrow(() -> new UsuarioNaoEncontradoException());
        Usuario remetente = usuarioRepository.findById(request.remetenteId()).orElseThrow(() -> new UsuarioNaoEncontradoException());

        Notificacao n = new Notificacao();
        n.setUsuario(usuario);
        n.setRemetente(remetente);
        n.setTipo(request.tipo());
        n.setMensagem(request.mensagem());
        n.setReferenciaId(request.referenciaId());

        return notificacaoRepository.save(n);
    }

    public List<Notificacao> getNotificacaoUsuario(Usuario u) {
        return notificacaoRepository.findByUsuario(u);
    }

}
