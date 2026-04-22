package com.example.teste.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String>{
    Optional<Usuario> findByNome(String nome);

    Optional<Usuario> findByEmail(String email);
}
