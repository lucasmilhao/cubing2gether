package com.example.teste.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.example.teste.model.Arquivo;
import com.example.teste.repository.ArquivoRepository;


@Service
public class UploadService {
    
    @Autowired
    private ArquivoRepository arquivoRepository;

    @Autowired
    private Cloudinary cloudinary;

    public String subirArquivo(MultipartFile file) {

        try {

            Map<?, ?> resultado = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                        "folder", "cubing2gether"
                    )
            );

            String url = resultado.get("secure_url").toString();

            String publicId = resultado.get("public_id").toString();

            Arquivo arquivo = new Arquivo();

            arquivo.setCaminho(url);
            arquivo.setNome(publicId);

            arquivoRepository.save(arquivo);

            return url;

        } catch (Exception e) {

            throw new RuntimeException("Erro ao enviar imagem para o Cloudinary", e);
        }
    }
}
