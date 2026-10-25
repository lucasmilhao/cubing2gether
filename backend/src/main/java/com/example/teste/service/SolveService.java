package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.worldcubeassociation.tnoodle.scrambles.PuzzleRegistry;

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
        solve.setTypeCubo(getTypeCubo(data.tipoCubo()));
        System.out.println(data.partidaId());
        System.out.println(getTypeCubo(data.tipoCubo()));
        if(data.partidaId() != null) {
            Partida partida = partidaRepository.findById(data.partidaId()).orElseThrow();
            solve.setPartida(partida);
        }
        
        solveRepository.save(solve);

        return solve;
    }

    public PuzzleRegistry getTypeCubo(String cubo) {
        return switch(cubo) {
            case "3x3x3" -> PuzzleRegistry.THREE;
            case "2x2x2" -> PuzzleRegistry.TWO;
            case "4x4x4" -> PuzzleRegistry.FOUR;
            case "5x5x5" -> PuzzleRegistry.FIVE;
            case "6x6x6" -> PuzzleRegistry.SIX;
            case "7x7x7" -> PuzzleRegistry.SEVEN; //SIX SEVEN
            case "square1" -> PuzzleRegistry.SQ1; //SIX SEVEN
            case "megaminx" -> PuzzleRegistry.MEGA;
            case "clock" -> PuzzleRegistry.CLOCK;
            case "skewb" -> PuzzleRegistry.SKEWB;
            case "pyraminx" -> PuzzleRegistry.PYRA;
            default -> {System.out.println("Deu merda"); yield null;}
        };
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

    public List<Solve> getSolvesCubo(String idUsuario, PuzzleRegistry cubo) {
        return getTodasSolvesUsuario(idUsuario).stream().filter(e -> e.getTypeCubo().equals(cubo)).toList();
    }

    public List<Solve> getTodasSolvesPartida(String idPartida) {
        return solveRepository.findAllByPartidaIdPartida(idPartida);
    }
    
}
