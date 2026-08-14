package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.example.teste.model.Solve;
import com.example.teste.service.SolveService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Solves", description = "Gerenciamento dos tempos e resoluções de cubo mágico.")
@CrossOrigin("*")
@RestController
@RequestMapping("/solves")
public class SolveController {

    @Autowired
    private SolveService service;

    @Operation(summary = "Registrar solve", description = "Registra um novo tempo de resolução.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Solve criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<SolveResponseDTO> createSolve(@RequestBody SolveRequestDTO request) {
        Solve solve = service.criarSolve(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new SolveResponseDTO(solve));
    }

    @DeleteMapping("{idSolve}")
    public ResponseEntity<SolveResponseDTO> deletarSolve(@PathVariable Long idSolve) {
        Solve solve = service.deletarSolve(idSolve);

        return ResponseEntity.ok(new SolveResponseDTO(solve));
    }

    @GetMapping
    public ResponseEntity<List<SolveResponseDTO>> getSolves() {
        List<SolveResponseDTO> listaSolves = service.getTodasSolves().stream()
                .map(SolveResponseDTO::new)
                .toList();

        return ResponseEntity.ok(listaSolves);
    }

    @Operation(summary = "Buscar solves de um usuário", description = "Retorna todos os solves pertencentes ao usuário informado.")
    @GetMapping("{idUsuario}")
    public ResponseEntity<List<SolveResponseDTO>> getSolvesUsuario(@PathVariable String idUsuario) {
        List<SolveResponseDTO> listaSolves = service.getTodasSolvesUsuario(idUsuario).stream()
                .map(SolveResponseDTO::new)
                .toList();

        return ResponseEntity.ok(listaSolves);
    }

    @GetMapping("/partida/{idPartida}")
    public ResponseEntity<List<SolveResponseDTO>> getSolvesPartida(@PathVariable String idPartida) {
        List<SolveResponseDTO> listaSolves = service.getTodasSolvesPartida(idPartida).stream()
                .map(SolveResponseDTO::new)
                .toList();

        return ResponseEntity.ok(listaSolves);
    }
}
