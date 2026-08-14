package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.model.Partida;
import com.example.teste.model.PartidaUsuario;
import com.example.teste.model.Solve;
import com.example.teste.repository.PartidaUsuarioRepository;
import com.example.teste.repository.SolveRepository;

@Service
public class PartidaUsuarioService {
    
    @Autowired
    private PartidaUsuarioRepository partidaUsuarioRepository;

    @Autowired
    private SolveRepository solveRepository;

    public PartidaUsuario editarPartida(String idUsuario, String idPartida) {
        PartidaUsuario pu = partidaUsuarioRepository.findByUsuarioIdAndPartidaIdPartida(idUsuario, idPartida)
        .orElseThrow(() -> new RuntimeException("Não foi possível encontrar partida-usuario"));

        Partida p = pu.getPartida();

        List<Solve> listaSolves = solveRepository.findAllByPartidaIdPartida(p.getIdPartida()).stream()
        .filter(e -> e.getUser().getId().equals(idUsuario)).toList();

        double media = listaSolves.stream().map(e -> e.getTempo()).mapToLong(Long::longValue).average().orElse(0);

        pu.setMedia(Math.round(media));

        return partidaUsuarioRepository.save(pu);
    }

    public List<PartidaUsuario> getPorIdPartida(String idPartida) {
        return partidaUsuarioRepository.findByPartidaIdPartida(idPartida);
    }
}
