package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.PartidaUsuario;

import java.util.List;
import java.util.Optional;

public interface PartidaUsuarioRepository extends JpaRepository<PartidaUsuario, String>{
    
    List<PartidaUsuario> findByPartidaIdPartida(String idPartida);

    Optional<PartidaUsuario> findByUsuarioIdAndPartidaIdPartida(String idUsuario, String idPartida);
    

}
