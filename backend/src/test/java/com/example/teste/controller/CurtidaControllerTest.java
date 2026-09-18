package com.example.teste.controller;

import com.example.teste.dto.curtida.CurtidaRequestDTO;
import com.example.teste.model.Curtida;
import com.example.teste.model.Postagem;
import com.example.teste.model.Usuario;
import com.example.teste.service.CurtidaService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CurtidaControllerTest {

    @Mock
    private CurtidaService service;

    @InjectMocks
    private CurtidaController controller;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private Usuario usuarioLogado;

    @BeforeEach
    void setUp() {
        usuarioLogado = new Usuario();
        usuarioLogado.setId("u1");
        usuarioLogado.setNome("Lucas");

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
    @DisplayName("POST /curtida deve criar uma nova curtida")
    void criarCurtida_deveRetornarCurtidaCriada() throws Exception {
        CurtidaRequestDTO request = new CurtidaRequestDTO("u1", "p1");

        Postagem postagem = new Postagem();
        postagem.setId("p1");

        Curtida curtida = new Curtida();
        curtida.setId("c1");
        curtida.setUsuario(usuarioLogado);
        curtida.setPostagem(postagem);

        when(service.criarCurtida(any(CurtidaRequestDTO.class))).thenReturn(curtida);

        mockMvc.perform(post("/curtida")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("c1"));
    }

    @Test
    @DisplayName("GET /curtida/{idPostagem} deve informar se o usuário logado curtiu a postagem")
    void getIsCurtido_deveRetornarBoolean() throws Exception {
        when(service.isPostagemCurtida(usuarioLogado, "p1")).thenReturn(true);

        mockMvc.perform(get("/curtida/p1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }
}
