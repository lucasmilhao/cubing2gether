package com.example.teste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Comentario;
import com.example.teste.model.Postagem;

public interface ComentarioRepository extends JpaRepository<Comentario, String>{
    
    List<Comentario> findByPostagem(Postagem postagem);

}
