package com.example.teste.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.postagem.PostagemRequestDTO;
import com.example.teste.dto.postagem.PostagemResponseDTO;
import com.example.teste.model.Postagem;
import com.example.teste.service.PostagemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Postagens", description = "Operações relacionadas às postagens da comunidade.")
@RestController
@RequestMapping("/postagem")
public class PostagemController {

    @Autowired
    private PostagemService service;

    @Operation(summary = "Listar postagens", description = "Retorna todas as postagens cadastradas.")
    @ApiResponse(responseCode = "200", description = "Lista de postagens retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<PostagemResponseDTO>> getTodas() {
        List<PostagemResponseDTO> lista = service.getTodasPostagens().stream()
                .map(PostagemResponseDTO::new)
                .toList();

        return ResponseEntity.ok(lista);
    }

    @Operation(summary = "Criar postagem", description = "Cria uma nova postagem para a comunidade.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Postagem criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados da postagem inválidos")
    })
    @PostMapping
    public ResponseEntity<PostagemResponseDTO> criarPostagem(@RequestBody @Valid PostagemRequestDTO request) {
        Postagem p = service.criarPostagem(request);

        return ResponseEntity.ok(new PostagemResponseDTO(p));
    }

    @Operation(summary = "Excluir postagem", description = "Remove uma postagem existente.")
    @ApiResponse(responseCode = "204", description = "Postagem removida com sucesso")
    @DeleteMapping("{idPostagem}")
    public ResponseEntity<PostagemResponseDTO> deletarPostagem(@PathVariable String idPostagem) {
        service.removerPostagem(idPostagem);

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Editar postagem", description = "Atualiza os dados de uma postagem existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Postagem atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada")
    })
    @PutMapping("{idPostagem}")
    public ResponseEntity<PostagemResponseDTO> editarPostagem(@PathVariable String idPostagem,
            @RequestBody @Valid PostagemRequestDTO request) {
        Postagem p = service.editarPostagem(idPostagem, request);

        return ResponseEntity.ok(new PostagemResponseDTO(p));
    }

}
