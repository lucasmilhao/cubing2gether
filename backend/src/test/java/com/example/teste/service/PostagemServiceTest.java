package com.example.teste.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.teste.dto.postagem.PostagemRequestDTO;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;
import com.example.teste.repository.PostagemRepository;
import com.example.teste.repository.ScrambleRepository;
import com.example.teste.repository.UsuarioRepository;

class PostagemServiceTest {

    @Test
    void criarPostagem_deveSalvarMarcacoesParaUsuariosMencionados() {
        PostagemService service = new PostagemService();

        PostagemRepository postagemRepository = mock(PostagemRepository.class);
        UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
        UsuarioService usuarioService = mock(UsuarioService.class);
        ScrambleRepository scrambleRepository = mock(ScrambleRepository.class);
        UploadService uploadService = mock(UploadService.class);
        FollowService followService = mock(FollowService.class);

        ReflectionTestUtils.setField(service, "postagemRepository", postagemRepository);
        ReflectionTestUtils.setField(service, "usuarioRepository", usuarioRepository);
        ReflectionTestUtils.setField(service, "usuarioService", usuarioService);
        ReflectionTestUtils.setField(service, "scrambleRepository", scrambleRepository);
        ReflectionTestUtils.setField(service, "uploadService", uploadService);
        ReflectionTestUtils.setField(service, "followService", followService);

        Usuario autor = new Usuario();
        autor.setId("autor-1");
        autor.setUsername("autor");

        Usuario joao = new Usuario();
        joao.setId("user-joao");
        joao.setUsername("joao");

        when(usuarioService.getUsuarioId("autor-1")).thenReturn(autor);
        when(usuarioRepository.findByUsername("joao")).thenReturn(Optional.of(joao));
        when(postagemRepository.save(any(Postagem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PostagemRequestDTO request = new PostagemRequestDTO(
                "Hoje treinei com @joao",
                null,
                "autor-1",
                null
        );

        Postagem postagem = service.criarPostagem(request, null);

        assertThat(postagem.getMarcacoes()).hasSize(1);
        assertThat(postagem.getMarcacoes().get(0).getUsuario().getUsername()).isEqualTo("joao");
    }
}
