package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.worldcubeassociation.tnoodle.scrambles.InvalidScrambleException;
import org.worldcubeassociation.tnoodle.scrambles.Puzzle;
import org.worldcubeassociation.tnoodle.scrambles.PuzzleRegistry;

import com.example.teste.dto.scramble.ScrambleRequestDTO;
import com.example.teste.dto.scramble.ScrambleResponseDTO;
import com.example.teste.model.Postagem;
import com.example.teste.model.Scramble;
import com.example.teste.repository.PostagemRepository;
import com.example.teste.repository.ScrambleRepository;

@Service
public class ScrambleService {
    
    @Autowired
    private ScrambleRepository scrambleRepository;

    @Autowired
    private PostagemRepository postagemRepository;

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
            return new ScrambleResponseDTO(null, scramble, null, svg);
        } catch (InvalidScrambleException e) {
            e.printStackTrace();
        }

        return new ScrambleResponseDTO(null, scramble, null, null);
    }

    public Scramble criarScramble(ScrambleRequestDTO request) {

        Puzzle puzzle = PuzzleRegistry.THREE.getScrambler();
        Scramble scramble = new Scramble();
        try {
            String svg = puzzle.drawScramble(request.scramble(), null).toString();
            scramble.setScramble(request.scramble());
            scramble.setSolution(request.solution());
            scramble.setSvg(svg);

            scrambleRepository.save(scramble);

        } catch (InvalidScrambleException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }


        return scramble;
    }

    public Scramble editarScramble(String idScramble, ScrambleRequestDTO request) {
        Puzzle puzzle = PuzzleRegistry.THREE.getScrambler();
        Scramble scramble = scrambleRepository.findById(idScramble).orElseThrow(() -> new RuntimeException());

        try {
            String svg = puzzle.drawScramble(request.scramble(), null).toString();
            scramble.setScramble(request.scramble());
            scramble.setSolution(request.solution());
            scramble.setSvg(svg);

            scrambleRepository.save(scramble);

        } catch (InvalidScrambleException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return scramble;
    }

    public void removerScramble(String idScramble) {
        Scramble s = scrambleRepository.findById(idScramble).orElseThrow(() -> new RuntimeException());

        List<Postagem> p = postagemRepository.findByScramble(s);
        p.stream().forEach(e-> {
            e.setScramble(null);
            postagemRepository.save(e);
        });

        scrambleRepository.delete(s);
    }
}
