package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.chat.participantes.ParticipantesConversaRequestDTO;
import com.example.teste.model.Conversa;
import com.example.teste.model.ParticipantesConversa;
import com.example.teste.model.Usuario;
import com.example.teste.repository.ParticipantesConversaRepository;

@Service
public class ParticipantesConversaService {

    @Autowired
    private ParticipantesConversaRepository participantesConversaRepository;

    @Autowired
    private ConversaService conversaService;

    @Autowired
    private UsuarioService usuarioService;

    public ParticipantesConversa adicionarParticipante(ParticipantesConversaRequestDTO request) {

        Usuario u = usuarioService.getUsuarioId(request.idUsuario());

        Conversa c = conversaService.getConversaPorId(request.idConversa());
        
        if(participantesConversaRepository.existsByUsuarioAndConversa(u, c)) throw new RuntimeException("Usuario já está na conversa.");

        ParticipantesConversa pc = new ParticipantesConversa();
        pc.setConversa(c);
        pc.setUsuario(u);

        return participantesConversaRepository.save(pc);
    }

    public void removerParticipante(String idConversa, String idUsuario) {
        Usuario u = usuarioService.getUsuarioId(idUsuario);
        Conversa c = conversaService.getConversaPorId(idConversa);
        ParticipantesConversa pc = participantesConversaRepository.findByUsuarioAndConversa(u, c);
        participantesConversaRepository.delete(pc);
        
        c.getParticipantes().remove(pc);
        
        if(c.getParticipantes().size() < 3) {
            conversaService.deletarConversa(c);
        }
    }

    public List<ParticipantesConversa> getTodosPorConversa(String idConversa) {
        Conversa c = conversaService.getConversaPorId(idConversa);
        List<ParticipantesConversa> lista = participantesConversaRepository.findByConversa(c);

        return lista;
    }

    public List<ParticipantesConversa> getTodos() {
        return participantesConversaRepository.findAll();
    }

    public List<ParticipantesConversa> getPorIdUsuario(String idUsuario) {
        Usuario u = usuarioService.getUsuarioId(idUsuario);

        return participantesConversaRepository.findByUsuario(u);
    }
    
}
