package com.example.teste.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.worldcubeassociation.tnoodle.scrambles.Puzzle;
import org.worldcubeassociation.tnoodle.scrambles.PuzzleRegistry;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/scrambles")
public class ScramblesController {
    
    @GetMapping("/{cube}")
    public ResponseEntity<String> getScramble(@PathVariable String cube) {
        Puzzle puzzle;
        switch(cube) {
            case "2x2x2" -> puzzle = PuzzleRegistry.TWO.getScrambler();
            case "3x3x3" -> puzzle = PuzzleRegistry.THREE.getScrambler();
            case "4x4x4" -> puzzle = PuzzleRegistry.FOUR.getScrambler();
            case "5x5x5" -> puzzle = PuzzleRegistry.FIVE.getScrambler();
            case "6x6x6" -> puzzle = PuzzleRegistry.SIX.getScrambler();
            case "7x7x7" -> puzzle = PuzzleRegistry.SEVEN.getScrambler();
            case "square1" -> puzzle = PuzzleRegistry.SQ1.getScrambler();
            case "megaminx" -> puzzle = PuzzleRegistry.MEGA.getScrambler();
            case "clock" -> puzzle = PuzzleRegistry.CLOCK.getScrambler();
            case "skewb" -> puzzle = PuzzleRegistry.SKEWB.getScrambler();
            case "pyraminx" -> puzzle = PuzzleRegistry.PYRA.getScrambler();
            case "FM" -> puzzle = PuzzleRegistry.THREE_FM.getScrambler();
            default -> puzzle = PuzzleRegistry.THREE.getScrambler();
        }
        
        String scramble = puzzle.generateScramble();
        return ResponseEntity.ok(scramble);
    }
    
}
