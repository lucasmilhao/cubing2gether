package com.example.teste.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.denuncia.DenunciaRequestDTO;
import com.example.teste.dto.denuncia.DenunciaResponseDTO;
import com.example.teste.model.Denuncia;
import com.example.teste.service.DenunciaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/denuncia")
public class DenunciaController {
    
    @Autowired
    private DenunciaService service;

    @PostMapping
    public ResponseEntity<DenunciaResponseDTO> criarDenuncia(@RequestBody @Valid DenunciaRequestDTO request) {
        Denuncia d = service.criarDenuncia(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new DenunciaResponseDTO(d));
    }

}
