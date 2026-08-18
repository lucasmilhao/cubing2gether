package com.example.teste.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.scramble.ScrambleRequestDTO;
import com.example.teste.dto.scramble.ScrambleResponseDTO;
import com.example.teste.model.Scramble;
import com.example.teste.service.ScrambleService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@RestController
@RequestMapping("/scrambles")
public class ScramblesController {

    @Autowired
    private ScrambleService service;

    @GetMapping("/{cube}")
    public ResponseEntity<ScrambleResponseDTO> getScramble(@PathVariable String cube) {
        ScrambleResponseDTO scramble = service.getScramble(cube);
        return ResponseEntity.ok(scramble);
    }

    @PostMapping
    public ResponseEntity<ScrambleResponseDTO> criarScramble(@RequestBody @Valid ScrambleRequestDTO request) {
        Scramble s = service.criarScramble(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ScrambleResponseDTO(s));
    }

    @PutMapping("{idScramble}")
    public ResponseEntity<ScrambleResponseDTO> editarScramble(@PathVariable String idScramble,
            @RequestBody @Valid ScrambleRequestDTO request) {
        Scramble s = service.editarScramble(idScramble, request);

        return ResponseEntity.ok(new ScrambleResponseDTO(s));
    }

    @DeleteMapping("{idScramble}")
    public ResponseEntity<Void> removerScramble(@PathVariable String idScramble) {
        service.removerScramble(idScramble);

        return ResponseEntity.noContent().build();
    }

}
