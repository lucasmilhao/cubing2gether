package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.chat.mensagem.MensagemRequestDTO;
import com.example.teste.dto.notificacao.NotificacaoRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Conversa;
import com.example.teste.model.Mensagem;
import com.example.teste.model.Usuario;
import com.example.teste.repository.ConversaRepository;
import com.example.teste.repository.MensagemRepository;
import com.example.teste.repository.UsuarioRepository;
import com.example.teste.type.TypeNotificacao;

@Service
public class MensagemService {
    
    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private ConversaRepository conversaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    public Mensagem criarMensagem(MensagemRequestDTO request) {

        Conversa c = conversaRepository.findById(request.idConversa()).orElseThrow(() -> new RuntimeException("Conversa não encontrada."));
        Usuario u = usuarioRepository.findById(request.idSender()).orElseThrow(() -> new UsuarioNaoEncontradoException());

        Mensagem mensagem = new Mensagem();
        mensagem.setConversa(c);
        mensagem.setSender(u);
        mensagem.setTexto(request.texto());

        c.getParticipantes().stream().forEach(e -> {
            
            notificacaoService.criarNotificacao(new NotificacaoRequestDTO(
                e.getUsuario().getId(), 
                u.getId(), 
                TypeNotificacao.MENSAGEM,
                request.texto(), 
                e.getId()));
        });

        mensagemRepository.save(mensagem);

        return mensagem;
    }

    public List<Mensagem> getMensagensConversa(String idConversa) { 
        List<Mensagem> listaMensagens = mensagemRepository.findByConversaIdConversaOrderByMandado(idConversa);
        listaMensagens.stream().forEach(e -> {
            e.setIsVisto(true);
            mensagemRepository.save(e);
        });

        return listaMensagens;
    }

}
