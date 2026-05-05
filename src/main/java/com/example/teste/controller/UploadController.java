package com.example.teste.controller;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.teste.model.Usuario;
import com.example.teste.service.UploadService;

@CrossOrigin("*")
@RestController
@RequestMapping("/uploads")
public class UploadController {

    @Autowired
    private UploadService service;
    
    @PostMapping
    public ResponseEntity<String> uploadArquivo(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal Usuario user) {
        String path = service.subirArquivo(file, user);

        return ResponseEntity.ok(path);
    }

    @GetMapping("/{nomeArquivo}")
    public ResponseEntity<Resource> getImagemUsuario(@PathVariable String nomeArquivo) throws Exception {
        Resource r = service.getImagem(nomeArquivo);
        return ResponseEntity.ok(r);
    }
}
