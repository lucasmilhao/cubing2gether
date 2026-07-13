package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.partida.PartidaRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Partida;
import com.example.teste.model.PartidaUsuario;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PartidaRepository;
import com.example.teste.repository.PartidaUsuarioRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class PartidaService {
    
    @Autowired
    private PartidaRepository partidaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PartidaUsuarioRepository partidaUsuarioRepository;

    public Partida criarPartida(PartidaRequestDTO request) {
        Partida p = new Partida();

        return partidaRepository.save(p);
    }

    public Partida criarPartidaComParticipantes(PartidaRequestDTO request) {
        Partida partida = new Partida();
        partidaRepository.save(partida);
        
        for(String id : request.idsUsuarios()) {
            Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new UsuarioNaoEncontradoException());
            
            PartidaUsuario pu = new PartidaUsuario();
            pu.setPartida(partida);
            pu.setUsuario(u);

            partidaUsuarioRepository.save(pu);
        }
        
        return partida;
    }

    public List<Partida> getTodas() {
        return partidaRepository.findAll();
    }
}
