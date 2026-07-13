package com.example.teste.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Solve;

import java.util.List;

public interface SolveRepository extends JpaRepository<Solve, Long>{
    List<Solve> findAllByPartidaIdPartida(String idPartida);
}
