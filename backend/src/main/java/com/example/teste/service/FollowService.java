package com.example.teste.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.follow.FollowRequestDTO;
import com.example.teste.dto.follow.FollowStatusDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Follow;
import com.example.teste.model.Usuario;
import com.example.teste.repository.FollowRepository;
import com.example.teste.repository.UsuarioRepository;

@Service
public class FollowService {
    
    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Follow criarFollow(FollowRequestDTO request) {
        Usuario uSeguidor = usuarioRepository.findById(request.idSeguidor()).orElseThrow(() -> new UsuarioNaoEncontradoException());
        Usuario uSeguindo = usuarioRepository.findById(request.idSeguindo()).orElseThrow(() -> new UsuarioNaoEncontradoException());

        Optional<Follow> follow = followRepository.findBySeguidorAndSeguindo(uSeguidor, uSeguindo);

        if(follow.isPresent()) {
            followRepository.delete(follow.get());
            return follow.get();
        }

        Follow f = new Follow();
        f.setSeguidor(uSeguidor);
        f.setSeguindo(uSeguindo);


        return followRepository.save(f);
    }

    public List<Follow> getSeguindo(String idUsuario) {
        Usuario u = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());

        List<Follow> lista = followRepository.findBySeguidor(u);

        return lista;
    }
    
    public List<Follow> getSeguidores(String idUsuario) {
        Usuario u = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());

        List<Follow> lista = followRepository.findBySeguindo(u);

        return lista;
    }

    public FollowStatusDTO getStatus(Usuario logado, String idUsuario) {
        Boolean sigo = followRepository.existsBySeguidorIdAndSeguindoId(logado.getId(), idUsuario);
        Boolean meSegue = followRepository.existsBySeguidorIdAndSeguindoId(idUsuario, logado.getId());

        return new FollowStatusDTO(sigo, meSegue);
    }

    public Follow deletarFollow(Follow f){
        followRepository.delete(f);

        return f;
    }

    public List<Follow> getAmigos(String idUsuario) {
        List<Follow> lista = followRepository.findAmigos(idUsuario);

        return lista;
    }
}
