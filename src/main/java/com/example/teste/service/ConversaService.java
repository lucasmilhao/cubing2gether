package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.chat.conversa.ConversaRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Conversa;
import com.example.teste.model.ParticipantesConversa;
import com.example.teste.model.Usuario;
import com.example.teste.repository.ConversaRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class ConversaService {
    
    @Autowired
    private ConversaRepository conversaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public Conversa criarConversa(ConversaRequestDTO request) {

        Conversa conversa = new Conversa(request);

        conversaRepository.save(conversa);

        return conversa;
    }

    public Conversa criarConversaComParticipantes(ConversaRequestDTO request,
        List<String> idsUsuarios
    ) {
        Conversa conversa = new Conversa(request);
        conversaRepository.save(conversa);

        for(String id : idsUsuarios) {

            Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new UsuarioNaoEncontradoException());

            ParticipantesConversa pc = new ParticipantesConversa();
            pc.setConversa(conversa);
            pc.setUsuario(u);
        }

        return conversa;
    }
}
