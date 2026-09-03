package com.example.teste.service;

import java.time.Instant;
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

        List<Notificacao> notificacaoExistente = notificacaoRepository
                .findByUsuarioIdAndReferenciaIdAndTipoAndIsLidaFalse(
                        request.usuarioId(),
                        request.referenciaId(),
                        request.tipo());

        if (!notificacaoExistente.isEmpty()) {

            Notificacao notificacao = notificacaoExistente.getFirst();

            notificacao.setMensagem(request.mensagem());
            notificacao.setCreatedAt(Instant.now());

            return notificacaoRepository.save(notificacao);
        }

        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new UsuarioNaoEncontradoException());
        Usuario remetente = usuarioRepository.findById(request.remetenteId())
                .orElseThrow(() -> new UsuarioNaoEncontradoException());

        Notificacao n = new Notificacao();
        n.setUsuario(usuario);
        n.setRemetente(remetente);
        n.setTipo(request.tipo());
        n.setMensagem(request.mensagem());
        n.setReferenciaId(request.referenciaId());

        return notificacaoRepository.save(n);
    }

    public Notificacao criarNotificacao(Notificacao notificacao) {

        if (notificacao.getUsuario().getId()
                .equals(notificacao.getRemetente().getId())) {
            return null;
        }

        return notificacaoRepository.save(notificacao);
    }

    public List<Notificacao> getNotificacaoUsuario(Usuario u) {
        List<Notificacao> lista = notificacaoRepository.findByUsuarioOrderByCreatedAt(u);
        return lista;
    }

    public Notificacao getNotificacaoId(String idNotificacao) {
        return notificacaoRepository.findById(idNotificacao)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
    }

    public void setNotificacaoLida(String idNotificacao) {
        Notificacao n = getNotificacaoId(idNotificacao);
        n.setIsLida(true);
        notificacaoRepository.save(n);
    }

}
