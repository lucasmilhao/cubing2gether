package com.example.teste.service;

import com.example.teste.dto.usuario.UsuarioEditRequestDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;
import com.example.teste.type.TypeUsuario;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UploadService uploadService;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId("1");
        usuario.setNome("Lucas");
        usuario.setEmail("lucas@email.com");
        usuario.setTipo(TypeUsuario.USUARIO);
        usuario.setIsGuest(false);
    }

    @Test
    @DisplayName("Deve criar um usuário e salvá-lo no repositório")
    void criarUser_deveSalvarUsuario() {
        UsuarioRequestDTO request = new UsuarioRequestDTO(
                "Lucas", "lucas@email.com", "senha123", TypeUsuario.USUARIO, false, null);

        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Usuario resultado = usuarioService.criarUser(request);

        assertThat(resultado.getNome()).isEqualTo("Lucas");
        assertThat(resultado.getEmail()).isEqualTo("lucas@email.com");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Deve retornar todos os usuários cadastrados")
    void getTodos_deveRetornarLista() {
        when(usuarioRepository.findAll()).thenReturn(List.of(usuario));

        List<Usuario> resultado = usuarioService.getTodos();

        assertThat(resultado).hasSize(1).contains(usuario);
        verify(usuarioRepository).findAll();
    }

    @Test
    @DisplayName("Deve retornar o usuário quando o id existir")
    void getUsuarioId_deveRetornarUsuario() {
        when(usuarioRepository.findById("1")).thenReturn(Optional.of(usuario));

        Usuario resultado = usuarioService.getUsuarioId("1");

        assertThat(resultado).isEqualTo(usuario);
    }

    @Test
    @DisplayName("Deve lançar exceção quando o usuário não for encontrado por id")
    void getUsuarioId_deveLancarExcecaoQuandoNaoEncontrado() {
        when(usuarioRepository.findById("999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.getUsuarioId("999"))
                .isInstanceOf(UsuarioNaoEncontradoException.class);
    }

    @Test
    @DisplayName("Deve buscar usuários por nome ou email")
    void getUsuarioPorNome_deveRetornarLista() {
        when(usuarioRepository.findByNomeContainingOrEmailContaining("Lucas", "Lucas"))
                .thenReturn(List.of(usuario));

        List<Usuario> resultado = usuarioService.getUsuarioPorNome("Lucas");

        assertThat(resultado).containsExactly(usuario);
    }

    @Test
    @DisplayName("Deve retornar o usuário pelo email")
    void getUsuarioPorEmail_deveRetornarUsuario() {
        when(usuarioRepository.findByEmail("lucas@email.com")).thenReturn(Optional.of(usuario));

        Usuario resultado = usuarioService.getUsuarioPorEmail("lucas@email.com");

        assertThat(resultado).isEqualTo(usuario);
    }

    @Test
    @DisplayName("Deve lançar exceção quando o email não for encontrado")
    void getUsuarioPorEmail_deveLancarExcecaoQuandoNaoEncontrado() {
        when(usuarioRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.getUsuarioPorEmail("naoexiste@email.com"))
                .isInstanceOf(UsuarioNaoEncontradoException.class);
    }

    @Test
    @DisplayName("Deve editar o nome do usuário sem alterar a foto quando nenhum arquivo for enviado")
    void editarUsuario_semArquivo_deveAtualizarNome() {
        UsuarioEditRequestDTO data = new UsuarioEditRequestDTO("1", "Lucas Editado");
        when(usuarioRepository.findById("1")).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Usuario resultado = usuarioService.editarUsuario(data, null);

        assertThat(resultado.getNome()).isEqualTo("Lucas Editado");
        verify(uploadService, never()).subirArquivo(any());
        verify(usuarioRepository).save(usuario);
    }

    @Test
    @DisplayName("Deve atualizar a foto do usuário quando um arquivo for enviado")
    void editarUsuario_comArquivo_deveAtualizarFotoENome() {
        UsuarioEditRequestDTO data = new UsuarioEditRequestDTO("1", "Lucas Editado");
        MultipartFile file = mock(MultipartFile.class);

        when(usuarioRepository.findById("1")).thenReturn(Optional.of(usuario));
        when(uploadService.subirArquivo(file)).thenReturn("http://nova-foto.com/foto.png");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Usuario resultado = usuarioService.editarUsuario(data, file);

        assertThat(resultado.getPicture()).isEqualTo("http://nova-foto.com/foto.png");
        assertThat(resultado.getNome()).isEqualTo("Lucas Editado");
        verify(uploadService).subirArquivo(file);
    }
}
