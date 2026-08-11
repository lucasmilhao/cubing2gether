package com.example.teste.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.chat.conversa.ConversaRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Conversa;
import com.example.teste.model.ParticipantesConversa;
import com.example.teste.model.Usuario;
import com.example.teste.repository.ConversaRepository;
import com.example.teste.repository.ParticipantesConversaRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class ConversaService {
    
    @Autowired
    private ConversaRepository conversaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ParticipantesConversaRepository participantesConversaRepository;
    
    public Conversa criarConversa(ConversaRequestDTO request) {

        Conversa conversa = new Conversa(request);

        conversaRepository.save(conversa);

        return conversa;
    }

    public Conversa criarConversaComParticipantes(ConversaRequestDTO request) {
        if (request.idsUsuarios().size() < 3) {
            Optional<Conversa> c = conversaRepository.findConversaByParticipantes(request.idsUsuarios(), (long) request.idsUsuarios().size());
            
            if(c.isPresent()) return c.get();
        }
        Conversa conversa = new Conversa(request);
        conversaRepository.save(conversa);


        for(String id : request.idsUsuarios()) {

            Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new UsuarioNaoEncontradoException());

            if(participantesConversaRepository.existsByUsuarioAndConversa(u, conversa))  throw new RuntimeException("Conversa e usuario já existem");

            ParticipantesConversa pc = new ParticipantesConversa();
            pc.setConversa(conversa);
            pc.setUsuario(u);
            pc.setIsAdmin(false);

            if(id == request.idsUsuarios().getLast()) pc.setIsAdmin(true);

            participantesConversaRepository.save(pc);
        }

        return conversa;
    }

    public List<Conversa> getConversaPorIdUsuario(String idUsuario) {
        Usuario u = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());
        List<Conversa> lista = participantesConversaRepository.findByUsuario(u)
        .stream().map(e -> e.getConversa()).toList();

        return lista;
    }

    public Conversa getConversaPorId(String idConversa) {
        Conversa c = conversaRepository.findById(idConversa).orElseThrow(() -> new RuntimeException("Conversa nao encontrada"));

        return c;
    }
}
