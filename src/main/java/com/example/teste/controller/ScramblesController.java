package com.example.teste.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.service.ScrambleService;

@CrossOrigin("*")
@RestController
@RequestMapping("/scrambles")
public class ScramblesController {
    
    @Autowired
    private ScrambleService service;

    @GetMapping("/{cube}")
    public ResponseEntity<String> getScramble(@PathVariable String cube) {
        String scramble = service.getScramble(cube);
        return ResponseEntity.ok(scramble);
    }
    
}
