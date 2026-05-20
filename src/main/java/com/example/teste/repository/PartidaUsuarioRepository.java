package com.example.teste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.PartidaUsuario;

public interface PartidaUsuarioRepository extends JpaRepository<PartidaUsuario, String>{
    
    List<PartidaUsuario> findByPartidaIdPartida(String idPartida);
    

}
