package com.example.teste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Conversa;
import com.example.teste.model.ParticipantesConversa;
import com.example.teste.model.Usuario;

public interface ParticipantesConversaRepository extends JpaRepository<ParticipantesConversa, String>{
    List<ParticipantesConversa> findByConversa(Conversa conversa);
    List<ParticipantesConversa> findByUsuario(Usuario usuario);
    ParticipantesConversa findByUsuarioAndConversa(Usuario usuario, Conversa conversa);
    Boolean existsByUsuarioAndConversa(Usuario usuario, Conversa conversa);
}
