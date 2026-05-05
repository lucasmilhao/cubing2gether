package com.example.teste.service;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;

import com.example.teste.model.Arquivo;
import com.example.teste.model.Usuario;
import com.example.teste.repository.ArquivoRepository;
import com.example.teste.repository.UsuarioRepository;


@Service
public class UploadService {
    
    @Autowired
    private ArquivoRepository arquivoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public String subirArquivo(MultipartFile file, Usuario user) {
        try {
            String baseDir = "C:/";
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String path = baseDir + File.separator + "uploads/" + fileName;

            File dest = new File(path);
            dest.getParentFile().mkdirs();

            file.transferTo(dest);

            System.out.println(path);
            Arquivo arquivo = new Arquivo();
            arquivo.setCaminho(path);
            arquivo.setNome(fileName);
            user.setFotoPerfil(fileName); 

            arquivoRepository.save(arquivo);
            usuarioRepository.save(user);

            return path;
        }catch (Exception e ) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    public Resource getImagem(String nome) throws Exception {
        Path path = Paths.get("C:/uploads/").resolve(nome);
        Resource resource = new UrlResource(path.toUri());
        return resource;
    }
}
