package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.partida.PartidaUsuarioResponseDTO;
import com.example.teste.model.PartidaUsuario;
import com.example.teste.service.PartidaUsuarioService;
@RestController
@RequestMapping("/usuario-partida")
public class PartidaUsuarioController {
    
    @Autowired
    private PartidaUsuarioService service;
    
    // Não uso
    // @GetMapping
    // public ResponseEntity<List<PartidaUsuarioResponseDTO>> getTodos() {
    //     return ResponseEntity.ok().body(repository.findAll().stream().map(PartidaUsuarioResponseDTO::new).toList());
    // }

    @GetMapping("/{idPartida}")
    public ResponseEntity<List<PartidaUsuarioResponseDTO>> getPorIdPartida(@PathVariable String idPartida) {
        List<PartidaUsuarioResponseDTO> lista = service.getPorIdPartida(idPartida).stream()
            .map(PartidaUsuarioResponseDTO::new)
            .toList();
            
        return ResponseEntity.ok().body(lista);
    }

    @PutMapping("/{idUsuario}/{idPartida}")
    public ResponseEntity<PartidaUsuarioResponseDTO> editarPartidaPorId(@PathVariable String idUsuario, @PathVariable String idPartida) {
        PartidaUsuario pu = service.editarPartida(idUsuario, idPartida);
        
        return ResponseEntity.ok(new PartidaUsuarioResponseDTO(pu));
    }
}
