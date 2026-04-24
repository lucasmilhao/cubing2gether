package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Conversa;
import com.example.teste.model.ParticipantesConversa;
import com.example.teste.model.Usuario;

public interface ParticipantesConversaRepository extends JpaRepository<ParticipantesConversa, String>{
    boolean existsByUsuarioAndConversa(Usuario usuario, Conversa conversa);
}
