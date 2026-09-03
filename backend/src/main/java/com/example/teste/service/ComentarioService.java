package com.example.teste.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.comentario.ComentarioRequestDTO;
import com.example.teste.model.Comentario;
import com.example.teste.model.Notificacao;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;
import com.example.teste.repository.ComentarioRepository;
import com.example.teste.type.TypeNotificacao;

@Service
public class ComentarioService {
    
    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PostagemService postagemService;

    @Autowired
    private NotificacaoService notificacaoService;

    public Comentario criarComentario(ComentarioRequestDTO request) {
        Usuario u = usuarioService.getUsuarioId(request.idUsuario());
        Postagem p = postagemService.getPostagemId(request.idPostagem());

        Comentario c = new Comentario();
        c.setUsuario(u);
        c.setPostagem(p);
        c.setConteudo(request.conteudo());

        Notificacao n = new Notificacao();
        n.setMensagem(u.getNome() + " comentou '" + c.getConteudo() +"' na sua publicação.");
        n.setRemetente(u);
        n.setUsuario(p.getUsuario());
        n.setReferenciaId(p.getId());
        n.setTipo(TypeNotificacao.COMENTARIO);

        notificacaoService.criarNotificacao(n);

        return comentarioRepository.save(c);
    }

    public List<Comentario> getComentariosPostagem(String idPostagem) {
        Postagem p = postagemService.getPostagemId(idPostagem);

        return comentarioRepository.findByPostagem(p);
    }

}
