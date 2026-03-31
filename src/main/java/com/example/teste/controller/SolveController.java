package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.solve.SolveRequestDTO;
import com.example.teste.dto.solve.SolveResponseDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.model.Solve;
import com.example.teste.service.SolveService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/solves")
public class SolveController {
    
    @Autowired
    private SolveService service;

    @PostMapping
    public ResponseEntity<SolveResponseDTO> createSolve(@RequestBody SolveRequestDTO request) {
        Solve solve = service.criarSolve(request);

        return ResponseEntity.ok(new SolveResponseDTO(solve));
    }

    @DeleteMapping("{idSolve}")
    public ResponseEntity<SolveResponseDTO> deletarSolve(@PathVariable Long idSolve) {
        Solve solve = service.deletarSolve(idSolve);

        return ResponseEntity.ok(new SolveResponseDTO(solve));
    }

    @GetMapping
    public ResponseEntity<List<SolveResponseDTO>> getSolves() {
        List<SolveResponseDTO> listaSolves = service.getTodasSolves();

        return ResponseEntity.ok(listaSolves);
    }
}
