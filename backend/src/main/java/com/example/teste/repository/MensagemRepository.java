package com.example.teste.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Conversa;
import com.example.teste.model.Mensagem;

public interface MensagemRepository extends JpaRepository<Mensagem, String> {
    List<Mensagem> findByConversaIdConversaAndMandadoGreaterThanEqualOrderByMandadoAsc(
        String idConversa,
        Instant data
    );

    void deleteByConversa(Conversa conversa);
}
