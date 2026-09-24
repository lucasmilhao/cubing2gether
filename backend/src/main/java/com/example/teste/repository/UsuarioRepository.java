package com.example.teste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String>{
    Optional<Usuario> findByNome(String nome);

    Optional<Usuario> findByUsername(String username);

    List<Usuario> findByUsernameContainingIgnoreCase(String username);

    List<Usuario> findByNomeContainingOrEmailContaining(String nome, String email);

    Optional<Usuario> findByEmail(String email);
}
