package com.example.teste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.teste.model.Follow;
import com.example.teste.model.Usuario;

public interface FollowRepository extends JpaRepository<Follow, String>{
        @Query("""
        SELECT f1
        FROM Follow f1
        WHERE f1.seguidor.id = :idUsuario
        AND EXISTS (
            SELECT f2
            FROM Follow f2
            WHERE f2.seguidor.id = f1.seguindo.id
                AND f2.seguindo.id = :idUsuario
        )
    """)
    List<Follow> findAmigos(String idUsuario);
    
    Boolean existsBySeguidorIdAndSeguindoId(String idSeguidor, String idSeguindo);

    Optional<Follow> findBySeguidorAndSeguindo(Usuario seguidor, Usuario seguindo);

    List<Follow> findBySeguidor(Usuario seguidor);

    List<Follow> findBySeguindo(Usuario seguindo);
}
