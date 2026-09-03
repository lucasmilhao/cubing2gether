package com.example.teste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Notificacao;
import com.example.teste.model.Usuario;
import com.example.teste.type.TypeNotificacao;

public interface NotificacaoRepository extends JpaRepository<Notificacao, String> {

    List<Notificacao> findByUsuarioOrderByCreatedAt(Usuario usuario);

    List<Notificacao> findByUsuarioIdAndReferenciaIdAndTipoAndIsLidaFalse(
            String idUsuario,
            String referenciaId,
            TypeNotificacao tipo
        );
}
