package com.example.teste.service;

import com.example.teste.dto.follow.FollowRequestDTO;
import com.example.teste.dto.follow.FollowStatusDTO;
import com.example.teste.dto.notificacao.NotificacaoRequestDTO;
import com.example.teste.model.Follow;
import com.example.teste.model.Usuario;
import com.example.teste.repository.FollowRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FollowServiceTest {

    @Mock
    private FollowRepository followRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private NotificacaoService notificacaoService;

    @InjectMocks
    private FollowService followService;

    private Usuario seguidor;
    private Usuario seguindo;

    @BeforeEach
    void setUp() {
        seguidor = new Usuario();
        seguidor.setId("u1");
        seguidor.setNome("Lucas");

        seguindo = new Usuario();
        seguindo.setId("u2");
        seguindo.setNome("Maria");
    }

    @Test
    @DisplayName("Deve criar um follow e notificar o usuário seguido quando ainda não houver relação")
    void criarFollow_quandoNaoSegue_deveCriarFollowENotificar() {
        FollowRequestDTO request = new FollowRequestDTO("u1", "u2");

        when(usuarioService.getUsuarioId("u1")).thenReturn(seguidor);
        when(usuarioService.getUsuarioId("u2")).thenReturn(seguindo);
        when(followRepository.findBySeguidorAndSeguindo(seguidor, seguindo)).thenReturn(Optional.empty());
        when(followRepository.save(any(Follow.class))).thenAnswer(inv -> inv.getArgument(0));

        Follow resultado = followService.criarFollow(request);

        assertThat(resultado.getSeguidor()).isEqualTo(seguidor);
        assertThat(resultado.getSeguindo()).isEqualTo(seguindo);
        verify(notificacaoService).criarNotificacao(any(NotificacaoRequestDTO.class));
        verify(followRepository).save(any(Follow.class));
        verify(followRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Deve remover o follow (deixar de seguir) quando a relação já existir")
    void criarFollow_quandoJaSegue_deveRemoverFollow() {
        FollowRequestDTO request = new FollowRequestDTO("u1", "u2");
        Follow existente = new Follow();
        existente.setSeguidor(seguidor);
        existente.setSeguindo(seguindo);

        when(usuarioService.getUsuarioId("u1")).thenReturn(seguidor);
        when(usuarioService.getUsuarioId("u2")).thenReturn(seguindo);
        when(followRepository.findBySeguidorAndSeguindo(seguidor, seguindo)).thenReturn(Optional.of(existente));

        Follow resultado = followService.criarFollow(request);

        assertThat(resultado).isEqualTo(existente);
        verify(followRepository).delete(existente);
        verify(followRepository, never()).save(any());
        verify(notificacaoService, never()).criarNotificacao(any(NotificacaoRequestDTO.class));
    }

    @Test
    @DisplayName("Deve retornar a lista de usuários que o usuário segue")
    void getSeguindo_deveRetornarLista() {
        Follow follow = new Follow();
        follow.setSeguidor(seguidor);
        follow.setSeguindo(seguindo);

        when(usuarioService.getUsuarioId("u1")).thenReturn(seguidor);
        when(followRepository.findBySeguidor(seguidor)).thenReturn(List.of(follow));

        List<Follow> resultado = followService.getSeguindo("u1");

        assertThat(resultado).containsExactly(follow);
    }

    @Test
    @DisplayName("Deve retornar a lista de seguidores do usuário")
    void getSeguidores_deveRetornarLista() {
        Follow follow = new Follow();
        follow.setSeguidor(seguindo);
        follow.setSeguindo(seguidor);

        when(usuarioService.getUsuarioId("u1")).thenReturn(seguidor);
        when(followRepository.findBySeguindo(seguidor)).thenReturn(List.of(follow));

        List<Follow> resultado = followService.getSeguidores("u1");

        assertThat(resultado).containsExactly(follow);
    }

    @Test
    @DisplayName("Deve retornar o status correto de seguir/ser seguido")
    void getStatus_deveRetornarStatusCorreto() {
        when(followRepository.existsBySeguidorIdAndSeguindoId("u1", "u2")).thenReturn(true);
        when(followRepository.existsBySeguidorIdAndSeguindoId("u2", "u1")).thenReturn(false);

        FollowStatusDTO status = followService.getStatus(seguidor, "u2");

        assertThat(status.sigo()).isTrue();
        assertThat(status.meSegue()).isFalse();
    }

    @Test
    @DisplayName("Deve considerar amigos quando o seguimento é mútuo")
    void isAmigo_deveRetornarTrueQuandoAmboSeguem() {
        when(followRepository.existsBySeguidorIdAndSeguindoId("u1", "u2")).thenReturn(true);
        when(followRepository.existsBySeguidorIdAndSeguindoId("u2", "u1")).thenReturn(true);

        Boolean resultado = followService.isAmigo(seguidor, "u2");

        assertThat(resultado).isTrue();
    }

    @Test
    @DisplayName("Deve retornar a lista de amigos do usuário")
    void getAmigos_deveRetornarLista() {
        Follow amigo = new Follow();
        amigo.setSeguidor(seguidor);
        amigo.setSeguindo(seguindo);

        when(followRepository.findAmigos("u1")).thenReturn(List.of(amigo));

        List<Follow> resultado = followService.getAmigos("u1");

        assertThat(resultado).containsExactly(amigo);
    }
}
