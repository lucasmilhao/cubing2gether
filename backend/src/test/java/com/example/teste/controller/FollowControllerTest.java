package com.example.teste.controller;

import com.example.teste.dto.follow.FollowRequestDTO;
import com.example.teste.dto.follow.FollowStatusDTO;
import com.example.teste.model.Follow;
import com.example.teste.model.Usuario;
import com.example.teste.service.FollowService;
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

@ExtendWith(MockitoExtension.class)
class FollowControllerTest {

    @Mock
    private FollowService service;

    @InjectMocks
    private FollowController controller;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private Usuario usuarioLogado;
    private Usuario outroUsuario;

    @BeforeEach
    void setUp() {
        usuarioLogado = new Usuario();
        usuarioLogado.setId("u1");
        usuarioLogado.setNome("Lucas");

        outroUsuario = new Usuario();
        outroUsuario.setId("u2");
        outroUsuario.setNome("Maria");

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
    @DisplayName("POST /follow deve criar um novo follow")
    void criarFollow_deveRetornarFollowCriado() throws Exception {
        FollowRequestDTO request = new FollowRequestDTO("u1", "u2");

        Follow follow = new Follow();
        follow.setId("f1");
        follow.setSeguidor(usuarioLogado);
        follow.setSeguindo(outroUsuario);

        when(service.criarFollow(any(FollowRequestDTO.class))).thenReturn(follow);

        mockMvc.perform(post("/follow")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("f1"));
    }

    @Test
    @DisplayName("GET /follow/seguindo/{id} deve retornar a lista de quem o usuário segue")
    void getSeguindo_deveRetornarLista() throws Exception {
        Follow follow = new Follow();
        follow.setId("f1");
        follow.setSeguidor(usuarioLogado);
        follow.setSeguindo(outroUsuario);

        when(service.getSeguindo("u1")).thenReturn(List.of(follow));

        mockMvc.perform(get("/follow/seguindo/u1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("GET /follow/seguidores/{id} deve retornar a lista de seguidores")
    void getSeguidores_deveRetornarLista() throws Exception {
        Follow follow = new Follow();
        follow.setId("f1");
        follow.setSeguidor(outroUsuario);
        follow.setSeguindo(usuarioLogado);

        when(service.getSeguidores("u1")).thenReturn(List.of(follow));

        mockMvc.perform(get("/follow/seguidores/u1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("GET /follow/status/{id} deve retornar o status de seguir/ser seguido")
    void getStatus_deveRetornarStatus() throws Exception {
        when(service.getStatus(usuarioLogado, "u2")).thenReturn(new FollowStatusDTO(true, false));

        mockMvc.perform(get("/follow/status/u2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sigo").value(true))
                .andExpect(jsonPath("$.meSegue").value(false));
    }

    @Test
    @DisplayName("GET /follow/amigos deve retornar a lista de amigos do usuário logado")
    void getAmigos_deveRetornarLista() throws Exception {
        Follow amigo = new Follow();
        amigo.setId("f1");
        amigo.setSeguidor(usuarioLogado);
        amigo.setSeguindo(outroUsuario);

        when(service.getAmigos("u1")).thenReturn(List.of(amigo));

        mockMvc.perform(get("/follow/amigos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Maria"));
    }
}
