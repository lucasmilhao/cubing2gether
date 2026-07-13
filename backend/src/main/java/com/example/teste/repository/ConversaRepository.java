package com.example.teste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.teste.model.Conversa;

public interface ConversaRepository extends JpaRepository<Conversa, String>{
    @Query("""
    SELECT c FROM Conversa c
    JOIN c.participantes p
    GROUP BY c
    HAVING 
        COUNT(DISTINCT p.usuario.id) = :size
        AND
        COUNT(DISTINCT CASE WHEN p.usuario.id IN :ids THEN p.usuario.id END) = :size
""")
    Optional<Conversa> findConversaByParticipantes(
        @Param("ids") List<String> ids,
        @Param("size") Long size
    );
}
