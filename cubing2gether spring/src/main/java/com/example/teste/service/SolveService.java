package com.example.teste.service;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.solve.SolveRequestDTO;
import com.example.teste.dto.solve.SolveResponseDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Solve;
import com.example.teste.model.Usuario;
import com.example.teste.repository.SolveRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class SolveService {

    @Autowired
    private SolveRepository solveRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public Solve criarSolve(SolveRequestDTO data) {
        Usuario user = usuarioRepository.findById(data.userId()).orElseThrow(() -> new UsuarioNaoEncontradoException());
        Solve solve = new Solve();
        solve.setTempo(data.tempo());
        solve.setScramble(data.scramble());
        solve.setPenalty(data.penalty());
        solve.setUser(user);

        solveRepository.save(solve);

        return solve;
    }

    public List<SolveResponseDTO> getTodasSolves() {
        return solveRepository.findAll().stream().map(SolveResponseDTO::new).sorted(Comparator.comparing(SolveResponseDTO::id).reversed()).toList();
    }
}
