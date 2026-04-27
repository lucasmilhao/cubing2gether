package com.example.teste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Conversa;
import com.example.teste.model.Mensagem;

public interface MensagemRepository extends JpaRepository<Mensagem, String> {
    List<Mensagem> findByConversaIdConversaOrderByMandado(String idConversa);
}
