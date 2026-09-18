package com.example.teste.service;

import com.example.teste.dto.curtida.CurtidaRequestDTO;
import com.example.teste.model.Curtida;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;
import com.example.teste.repository.CurtidaRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CurtidaServiceTest {

    @Mock
    private CurtidaRepository curtidaRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private PostagemService postagemService;

    @InjectMocks
    private CurtidaService curtidaService;

    private Usuario usuario;
    private Postagem postagem;
    private CurtidaRequestDTO request;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId("u1");

        postagem = new Postagem();
        postagem.setId("p1");

        request = new CurtidaRequestDTO("u1", "p1");

        when(usuarioService.getUsuarioId("u1")).thenReturn(usuario);
        when(postagemService.getPostagemId("p1")).thenReturn(postagem);
    }

    @Test
    @DisplayName("Deve criar uma curtida quando o usuário ainda não curtiu a postagem")
    void criarCurtida_quandoNaoExiste_deveCriarNovaCurtida() {
        when(curtidaRepository.findByUsuarioAndPostagem(usuario, postagem)).thenReturn(Optional.empty());
        when(curtidaRepository.save(any(Curtida.class))).thenAnswer(inv -> inv.getArgument(0));

        Curtida resultado = curtidaService.criarCurtida(request);

        assertThat(resultado.getUsuario()).isEqualTo(usuario);
        assertThat(resultado.getPostagem()).isEqualTo(postagem);
        verify(curtidaRepository).save(any(Curtida.class));
        verify(curtidaRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Deve remover a curtida (descurtir) quando ela já existir")
    void criarCurtida_quandoJaExiste_deveRemoverCurtida() {
        Curtida existente = new Curtida();
        existente.setUsuario(usuario);
        existente.setPostagem(postagem);

        when(curtidaRepository.findByUsuarioAndPostagem(usuario, postagem)).thenReturn(Optional.of(existente));

        Curtida resultado = curtidaService.criarCurtida(request);

        assertThat(resultado).isEqualTo(existente);
        verify(curtidaRepository).delete(existente);
        verify(curtidaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve retornar true quando a postagem já foi curtida pelo usuário")
    void isPostagemCurtida_deveRetornarTrueQuandoExiste() {
        when(curtidaRepository.findByUsuarioAndPostagem(usuario, postagem))
                .thenReturn(Optional.of(new Curtida()));

        Boolean resultado = curtidaService.isPostagemCurtida(usuario, "p1");

        assertThat(resultado).isTrue();
    }

    @Test
    @DisplayName("Deve retornar false quando a postagem não foi curtida pelo usuário")
    void isPostagemCurtida_deveRetornarFalseQuandoNaoExiste() {
        when(curtidaRepository.findByUsuarioAndPostagem(usuario, postagem)).thenReturn(Optional.empty());

        Boolean resultado = curtidaService.isPostagemCurtida(usuario, "p1");

        assertThat(resultado).isFalse();
    }
}
