package com.example.teste.service;

import org.springframework.stereotype.Service;
import org.worldcubeassociation.tnoodle.scrambles.InvalidScrambleException;
import org.worldcubeassociation.tnoodle.scrambles.Puzzle;
import org.worldcubeassociation.tnoodle.scrambles.PuzzleRegistry;

import com.example.teste.dto.scramble.ScrambleResponseDTO;

@Service
public class ScrambleService {
    
    public ScrambleResponseDTO getScramble(String cube) {
        
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
        try {
            String svg = puzzle.drawScramble(scramble, null).toString();
            return new ScrambleResponseDTO(scramble, svg);
        } catch (InvalidScrambleException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return new ScrambleResponseDTO(scramble, null);
    }
}
