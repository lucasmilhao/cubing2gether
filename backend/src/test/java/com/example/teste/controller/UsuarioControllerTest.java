package com.example.teste.controller;

import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.model.Usuario;
import com.example.teste.service.UsuarioService;
import com.example.teste.type.TypeUsuario;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testes da camada HTTP com MockMvc "standalone" (sem subir o contexto do
 * Spring nem os filtros de segurança). O UsuarioService é mockado com
 * Mockito, e um resolver customizado injeta um usuário fixo em qualquer
 * parâmetro anotado com @AuthenticationPrincipal.
 */
@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioService service;

    @InjectMocks
    private UsuarioController controller;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private Usuario usuarioLogado;

    @BeforeEach
    void setUp() {
        usuarioLogado = new Usuario();
        usuarioLogado.setId("1");
        usuarioLogado.setNome("Lucas");
        usuarioLogado.setEmail("lucas@email.com");
        usuarioLogado.setTipo(TypeUsuario.USUARIO);
        usuarioLogado.setIsGuest(false);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter parameter) {
                        return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
                    }

                    @Override
                    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                            NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                        return usuarioLogado;
                    }
                })
                .build();
    }

    @Test
    @DisplayName("GET /usuarios deve retornar a lista de usuários")
    void getAll_deveRetornarListaDeUsuarios() throws Exception {
        when(service.getTodos()).thenReturn(List.of(usuarioLogado));

        mockMvc.perform(get("/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nome").value("Lucas"));
    }

    @Test
    @DisplayName("GET /usuarios/{id} deve retornar o usuário correspondente")
    void getUsuarioPorId_deveRetornarUsuario() throws Exception {
        when(service.getUsuarioId("1")).thenReturn(usuarioLogado);

        mockMvc.perform(get("/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.email").value("lucas@email.com"));
    }

    @Test
    @DisplayName("GET /usuarios/nome/{nome} deve retornar os usuários encontrados")
    void getUsuarioPorNome_deveRetornarLista() throws Exception {
        when(service.getUsuarioPorNome("Lucas")).thenReturn(List.of(usuarioLogado));

        mockMvc.perform(get("/usuarios/nome/Lucas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("GET /usuarios/email/{email} deve retornar o usuário correspondente")
    void getUsuarioPorEmail_deveRetornarUsuario() throws Exception {
        when(service.getUsuarioPorEmail("lucas@email.com")).thenReturn(usuarioLogado);

        mockMvc.perform(get("/usuarios/email/lucas@email.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Lucas"));
    }

    @Test
    @DisplayName("GET /usuarios/me deve retornar o usuário autenticado")
    void getMe_deveRetornarUsuarioAutenticado() throws Exception {
        mockMvc.perform(get("/usuarios/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.nome").value("Lucas"));
    }

    @Test
    @DisplayName("POST /usuarios deve criar um novo usuário")
    void criarUser_deveRetornarUsuarioCriado() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO(
                "Novo", "novo@email.com", "senha1234", TypeUsuario.USUARIO, false, null);

        Usuario criado = new Usuario();
        criado.setId("2");
        criado.setNome("Novo");
        criado.setEmail("novo@email.com");
        criado.setTipo(TypeUsuario.USUARIO);
        criado.setIsGuest(false);

        when(service.criarUser(any())).thenReturn(criado);

        mockMvc.perform(post("/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Novo"));
    }
}
