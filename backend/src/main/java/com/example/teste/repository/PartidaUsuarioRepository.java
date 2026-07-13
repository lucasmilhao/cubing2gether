package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import com.example.teste.model.PartidaUsuario;

public interface PartidaUsuarioRepository extends JpaRepository<PartidaUsuario, String>{
    
    List<PartidaUsuario> findByPartidaIdPartida(String idPartida);

    Optional<PartidaUsuario> findByUsuarioIdAndPartidaIdPartida(String idUsuario, String idPartida);
    

}
