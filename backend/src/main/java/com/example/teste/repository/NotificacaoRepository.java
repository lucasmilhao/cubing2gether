package com.example.teste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Notificacao;
import com.example.teste.model.Usuario;

public interface NotificacaoRepository extends JpaRepository<Notificacao, String> {
    
    List<Notificacao> findByUsuario(Usuario usuario);

}
