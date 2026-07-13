package com.example.teste.dto.arquivo;

import com.example.teste.model.Arquivo;

public record ArquivoResponseDTO(String idArquivo, String nome, String caminho) {

    public ArquivoResponseDTO(Arquivo a) {
        this(a.getIdArquivo(), a.getNome(), a.getCaminho());
    }
    
}
