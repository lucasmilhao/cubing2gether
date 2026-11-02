package com.example.teste.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.example.teste.dto.notificacao.NotificacaoCriadaEvent;
import com.example.teste.dto.notificacao.NotificacaoRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Notificacao;
import com.example.teste.model.Usuario;
import com.example.teste.repository.NotificacaoRepository;
import com.example.teste.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Transactional
    public Notificacao criarNotificacao(
            NotificacaoRequestDTO request
    ) {
        if (request.usuarioId().equals(request.remetenteId())) {
            return null;
        }

        List<Notificacao> existentes = notificacaoRepository
                .findByUsuarioIdAndReferenciaIdAndTipoAndIsLidaFalse(
                        request.usuarioId(),
                        request.referenciaId(),
                        request.tipo()
                );

        Notificacao notificacao;

        if (!existentes.isEmpty()) {
            notificacao = existentes.getFirst();

            notificacao.setMensagem(request.mensagem());
            notificacao.setCreatedAt(Instant.now());

        } else {
            Usuario usuario = usuarioRepository
                    .findById(request.usuarioId())
                    .orElseThrow(UsuarioNaoEncontradoException::new);

            Usuario remetente = usuarioRepository
                    .findById(request.remetenteId())
                    .orElseThrow(UsuarioNaoEncontradoException::new);

            notificacao = new Notificacao();

            notificacao.setUsuario(usuario);
            notificacao.setRemetente(remetente);
            notificacao.setTipo(request.tipo());
            notificacao.setMensagem(request.mensagem());
            notificacao.setReferenciaId(request.referenciaId());
            notificacao.setIsLida(false);
        }

        Notificacao salva
                = notificacaoRepository.save(notificacao);

        eventPublisher.publishEvent(
                new NotificacaoCriadaEvent(salva.getId())
        );

        return salva;
    }

    @Transactional
    public Notificacao criarNotificacao(Notificacao notificacao) {

        if (notificacao.getUsuario().getId()
                .equals(notificacao.getRemetente().getId())) {
            return null;
        }

        if (notificacao.getIsLida() == null) {
            notificacao.setIsLida(false);
        }

        Notificacao salva
                = notificacaoRepository.save(notificacao);

        eventPublisher.publishEvent(
                new NotificacaoCriadaEvent(salva.getId())
        );

        return salva;
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

    public void setNotificacoesLidas(Usuario u) {
        getNotificacaoUsuario(u).forEach(n -> {
            n.setIsLida(true);
            notificacaoRepository.save(n);
        });
    }

}
