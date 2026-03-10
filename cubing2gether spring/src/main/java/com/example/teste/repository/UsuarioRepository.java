package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String>{
    Usuario findByNome(String nome);

    Usuario findByEmail(String email);
}
