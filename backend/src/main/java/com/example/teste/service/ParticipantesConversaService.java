package com.example.teste.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.chat.participantes.ParticipantesConversaRequestDTO;
import com.example.teste.model.Conversa;
import com.example.teste.model.ParticipantesConversa;
import com.example.teste.model.Usuario;
import com.example.teste.repository.ConversaRepository;
import com.example.teste.repository.ParticipantesConversaRepository;

@Service
public class ParticipantesConversaService {

    @Autowired
    private ParticipantesConversaRepository participantesConversaRepository;

    @Autowired
    private ConversaRepository conversaRepository;

    @Autowired
    private UsuarioService usuarioService;

    public ParticipantesConversa adicionarParticipante(ParticipantesConversaRequestDTO request) {

        Usuario u = usuarioService.getUsuarioId(request.idUsuario());

        Conversa c = conversaRepository.findById(request.idConversa()).orElseThrow(() -> new RuntimeException("Conversa não encontrada"));
        
        if(participantesConversaRepository.existsByUsuarioAndConversa(u, c)) throw new RuntimeException("Usuario já está na conversa.");

        ParticipantesConversa pc = new ParticipantesConversa();
        pc.setConversa(c);
        pc.setUsuario(u);
        pc.setIsAtivo(true);

        return participantesConversaRepository.save(pc);
    }
    
    public List<ParticipantesConversa> getTodosPorConversa(String idConversa) {
        Conversa c = conversaRepository.findById(idConversa).orElseThrow(() -> new RuntimeException("Conversa não encontrada"));
        List<ParticipantesConversa> lista = participantesConversaRepository.findByConversa(c).stream().filter(e -> e.getIsAtivo()).toList();

        return lista;
    }

    public List<ParticipantesConversa> getTodos() {
        return participantesConversaRepository.findAll();
    }

    public List<ParticipantesConversa> getPorIdUsuario(String idUsuario) {
        Usuario u = usuarioService.getUsuarioId(idUsuario);
        return participantesConversaRepository.findByUsuario(u).stream().filter(e -> e.getIsAtivo()).toList();
    }
    
    
    public void removerParticipante(String idConversa, String idUsuario) {
        Usuario u = usuarioService.getUsuarioId(idUsuario);
        Conversa c = conversaRepository.findById(idConversa)
                .orElseThrow(() -> new RuntimeException("Conversa não encontrada"));
        ParticipantesConversa pc = participantesConversaRepository.findByUsuarioAndConversa(u, c);
        pc.setIsAtivo(false);
        pc.setEntrou(Instant.now());
        participantesConversaRepository.save(pc);

        if(c.getParticipantes().size() > 2) {
            handleAdmin(pc, c);
        }

    }


    public void handleAdmin(ParticipantesConversa pc, Conversa c) {
        c.getParticipantes().remove(pc);
        participantesConversaRepository.delete(pc);
        conversaRepository.save(c);

        if(pc.getIsAdmin()) {
            ParticipantesConversa novoAdmin = c.getParticipantes().stream().sorted(Comparator.comparing(ParticipantesConversa::getEntrou)).toList().getFirst();
            participantesConversaRepository.save(novoAdmin);
        }
    }
}
