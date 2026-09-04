package com.example.teste.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Postagem;
import com.example.teste.model.Scramble;
import com.example.teste.model.Usuario;

public interface PostagemRepository extends JpaRepository<Postagem, String> {
    List<Postagem> findByScramble(Scramble scramble);
    List<Postagem> findByUsuario(Usuario usuario);
    List<Postagem> findAllByOrderByCreatedAtDesc();
}
