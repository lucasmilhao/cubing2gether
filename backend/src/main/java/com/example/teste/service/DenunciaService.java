package com.example.teste.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.denuncia.DenunciaRequestDTO;
import com.example.teste.model.Denuncia;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;
import com.example.teste.repository.DenunciaRepository;

@Service
public class DenunciaService {
    
    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PostagemService postagemService;

    public Denuncia criarDenuncia(DenunciaRequestDTO request) {
        System.out.println("CHEGOU ATE AQUI");
        Usuario u = usuarioService.getUsuarioId(request.idUsuario());

        if(request.idPostagem() != null) {
            Postagem p = postagemService.getPostagemId(request.idPostagem());
    
            Optional<Denuncia> denuncia = denunciaRepository.findByPostagemAndUsuario(p, u);
            
            if(denuncia.isPresent() && Duration.between(denuncia.get().getCreatedAt(), Instant.now()).abs().toHours() < 24) return denuncia.get();

            else return denunciaRepository.save(new Denuncia(u, p));
        }

        Denuncia denuncia = new Denuncia();
        denuncia.setUsuario(u);

        return denunciaRepository.save(denuncia);
    }

    public int quantidadeDenunciaDia(List<Denuncia> denuncias) {
        List<Instant> instants = denuncias.stream()
        .collect(Collectors.toMap(Denuncia::getUsuario, Function.identity(), (d1, d2) -> d1))
        .values()
        .stream()
        .map(Denuncia::getCreatedAt)
        .toList();

        int contador = 0;
        for(int i = 0; i < denuncias.size(); i++) {
            for(int j = i + 1; j < denuncias.size(); j++) {
                Duration d = Duration.between(instants.get(i), instants.get(j));

                if(d.abs().toHours() < 24) {
                    contador++;
                }
            }
        }

        return contador;
    }

}
