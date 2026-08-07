package com.example.teste.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Denuncia;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;

public interface DenunciaRepository extends JpaRepository<Denuncia, String> {
    List<Denuncia> findByUsuario(Usuario usuario);
    List<Denuncia> findByPostagem(Postagem postagem);
    Optional<Denuncia> findByPostagemAndUsuario(Postagem postagem, Usuario usuario);
}
