package com.example.teste.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.teste.dto.postagem.PostagemRequestDTO;
import com.example.teste.model.MarcacaoPostagem;
import com.example.teste.model.Postagem;
import com.example.teste.model.Scramble;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PostagemRepository;
import com.example.teste.repository.ScrambleRepository;
import com.example.teste.repository.UsuarioRepository;
import com.example.teste.type.TypeUsuario;

@Service
public class PostagemService {

    private static final Pattern MENTION_PATTERN = Pattern.compile("@([a-zA-Z0-9_]+)");

    @Autowired
    private PostagemRepository postagemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ScrambleRepository scrambleRepository;

    @Autowired
    private UploadService uploadService;

    @Autowired
    private FollowService followService;

    public Postagem criarPostagem(PostagemRequestDTO request, MultipartFile file) {
        Usuario u = usuarioService.getUsuarioId(request.idUsuario());
        Scramble s = null;

        if (request.idScramble() != null) {
            s = scrambleRepository.findById(request.idScramble())
                    .orElseThrow(() -> new RuntimeException("Scramble nao encontrado"));
        }

        Postagem p = new Postagem();
        p.setDescricao(request.descricao());
        p.setUsuario(u);
        p.setScramble(s);

        if (file != null) {
            String url = uploadService.subirArquivo(file);
            p.setCaminhoImagem(url);
        }

        processarMarcacoes(p);

        return postagemRepository.save(p);
    }

    public List<Postagem> getTodasPostagens(Usuario u) {
        return postagemRepository.findAllByOrderByCreatedAtDesc().stream().filter(e -> isPostValido(e, u)).toList();
    }

    public List<Postagem> getPostagemPorUsuario(String idUsuario) {
        Usuario u = usuarioService.getUsuarioId(idUsuario);

        return postagemRepository.findByUsuario(u);
    }

    @Transactional
    public Postagem removerPostagem(String idPostagem) {
        Postagem p = postagemRepository.findById(idPostagem).orElseThrow(() -> new RuntimeException());

        postagemRepository.delete(p);

        return p;
    }

    public Postagem editarPostagem(String idPostagem, PostagemRequestDTO request) {
        Postagem p = postagemRepository.findById(idPostagem).orElseThrow(() -> new RuntimeException());

        Scramble s = null;

        if (request.idScramble() != null) {
            s = scrambleRepository.findById(request.idScramble())
                    .orElseThrow(() -> new RuntimeException("Scramble nao encontrado"));
        }

        p.setScramble(s);
        p.setDescricao(request.descricao());
        p.getMarcacoes().clear();
        processarMarcacoes(p);

        return postagemRepository.save(p);
    }

    private void processarMarcacoes(Postagem postagem) {
        if (postagem.getDescricao() == null || postagem.getDescricao().isBlank()) {
            return;
        }

        Matcher matcher = MENTION_PATTERN.matcher(postagem.getDescricao());
        Set<String> usernamesProcessados = new HashSet<>();

        while (matcher.find()) {
            String username = matcher.group(1).toLowerCase();

            if (!usernamesProcessados.add(username)) {
                continue;
            }

            Usuario usuarioMarcado = usuarioRepository.findByUsername(username).orElse(null);

            if (usuarioMarcado == null) {
                continue;
            }

            MarcacaoPostagem marcacao = new MarcacaoPostagem();
            marcacao.setPostagem(postagem);
            marcacao.setUsuario(usuarioMarcado);
            marcacao.setPosicaoInicio(matcher.start());
            marcacao.setPosicaoFim(matcher.end());
            postagem.getMarcacoes().add(marcacao);
        }
    }

    public Postagem getPostagemId(String idPostagem) {
        return postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new RuntimeException("Postagem não encontrada"));
    }

    public Boolean isPostValido(Postagem post, Usuario u) {
        
        Boolean isAdmin = post.getUsuario().getTipo().equals(TypeUsuario.ADMIN);
        Boolean isCriador = post.getUsuario().getTipo().equals(TypeUsuario.CRIADOR);
        Boolean isAmigo = followService.isAmigo(u, post.getUsuario().getId());
        Boolean isEu = post.getUsuario().getId().equals(u.getId());

        return isAdmin || isAmigo || isCriador || isEu;
    }
}
