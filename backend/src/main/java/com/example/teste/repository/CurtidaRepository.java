package com.example.teste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Curtida;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;

public interface CurtidaRepository extends JpaRepository<Curtida, String> {

    List<Curtida> findByPostagemOrderByCreatedAt(Postagem postagem);

    List<Curtida> findByUsuarioOrderByCreatedAt(Usuario usuario);

    Optional<Curtida> findByUsuarioAndPostagem(Usuario usuario, Postagem postagem);

}
