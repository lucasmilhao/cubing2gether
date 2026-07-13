package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.solve.SolveRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.exception.solve.SolveNaoEncontradaException;
import com.example.teste.model.Partida;
import com.example.teste.model.Solve;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PartidaRepository;
import com.example.teste.repository.SolveRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class SolveService {

    @Autowired
    private SolveRepository solveRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PartidaRepository partidaRepository;

    public Solve criarSolve(SolveRequestDTO data) {
        Usuario user = usuarioRepository.findById(data.userId()).orElseThrow(() -> new UsuarioNaoEncontradoException());
        Solve solve = new Solve();
        solve.setTempo(data.tempo());
        solve.setScramble(data.scramble());
        solve.setPenalty(data.penalty());
        solve.setUser(user);
        System.out.println(data.partidaId());
        if(data.partidaId() != null) {
            Partida partida = partidaRepository.findById(data.partidaId()).orElseThrow();
            solve.setPartida(partida);
        }
        
        solveRepository.save(solve);

        return solve;
    }

    public Solve deletarSolve(Long id) {
        Solve solve = solveRepository.findById(id).orElseThrow(() -> new SolveNaoEncontradaException());

        solveRepository.delete(solve);

        return solve;
    }

    public List<Solve> getTodasSolves() {

        List<Solve> listaSolves = solveRepository.findAll();

        return listaSolves.isEmpty() ? null : listaSolves;
    }

    public List<Solve> getTodasSolvesUsuario(String id) {
        return solveRepository.findAll().stream()
        .filter(e -> e.getUser().getId().equals(id))
        .filter(e -> e.getPartida() == null)
        .toList();
    }

    public List<Solve> getTodasSolvesPartida(String idPartida) {
        return solveRepository.findAllByPartidaIdPartida(idPartida);
    }
    
}
