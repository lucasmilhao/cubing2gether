package com.example.teste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.teste.model.Partida;

public interface PartidaRepository extends JpaRepository<Partida, String> {
    
    @Query("""
    SELECT p FROM Partida p
    JOIN p.jogadores j
    GROUP BY p
    HAVING 
        COUNT(DISTINCT j.usuario.id) = :size
        AND
        COUNT(DISTINCT CASE 
            WHEN j.usuario.id IN :ids 
            THEN j.usuario.id 
        END) = :size
""")
    Optional<Partida> findPartidaByParticipantes(
        @Param("ids") List<String> ids,
        @Param("size") Long size
    );
}
