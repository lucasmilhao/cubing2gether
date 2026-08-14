package com.example.teste.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.teste.dto.login.LoginRequestDTO;
import com.example.teste.dto.login.LoginResponseDTO;
import com.example.teste.dto.usuario.RedefinirSenhaRequestDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.dto.usuario.UsuarioResponseDTO;
import com.example.teste.service.AuthService;
import com.example.teste.type.TypeProvider;
import com.google.common.net.HttpHeaders;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(
        name = "Autenticação",
        description = "Endpoints relacionados à autenticação, cadastro e recuperação de senha."
)
public class AuthController {

    @Autowired
    private AuthService service;

    @Operation(
            summary = "Realizar login",
            description = "Autentica um usuário utilizando e-mail e senha."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Login realizado com sucesso",
                    content = @Content(
                            schema = @Schema(implementation = LoginResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "E-mail ou senha inválidos"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> fazerLoginUsuarioLocal(
            @RequestBody
            @Valid
            LoginRequestDTO request,
            HttpServletResponse response) {

        LoginResponseDTO result =
                service.login(TypeProvider.LOCAL, request);

        ResponseCookie cookie = ResponseCookie
                .from("access_token", result.token())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(60 * 60 * 24)
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );

        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Login com Google",
            description = "Autentica o usuário utilizando um token de autenticação fornecido pelo Google."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Login realizado com sucesso"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Token do Google inválido"
            )
    })
    @PostMapping("/login/google")
    public ResponseEntity<LoginResponseDTO> fazerLoginUsuarioGoogle(
            @RequestBody String request,
            HttpServletResponse response) {

        LoginResponseDTO result =
                service.login(TypeProvider.GOOGLE, request);

        ResponseCookie cookie = ResponseCookie
                .from("access_token", result.token())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(60 * 60 * 24)
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );

        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Cadastrar usuário",
            description = "Cria uma nova conta de usuário."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Usuário criado com sucesso"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados inválidos"
            )
    })
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> registrarUsuario(
            @RequestBody @Valid UsuarioRequestDTO request) {

        LoginResponseDTO response =
                service.registrarUsuario(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(
            summary = "Solicitar recuperação de senha",
            description = "Solicita o envio de um e-mail para redefinição da senha."
    )
    @ApiResponse(
            responseCode = "204",
            description = "Solicitação processada com sucesso"
    )
    @PostMapping("/recuperar-senha")
    public ResponseEntity<Void> rcuperarSenha(
            @RequestBody UsuarioResponseDTO request) {

        service.solicitarRedefinicao(request.email());

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Redefinir senha",
            description = "Redefine a senha utilizando um token de recuperação."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Senha redefinida com sucesso"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Token ou nova senha inválidos"
            )
    })
    @PostMapping("/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(
            @RequestBody RedefinirSenhaRequestDTO request) {

        service.redefinirSenha(request);

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Realizar logout",
            description = "Remove o cookie contendo o token de autenticação."
    )
    @ApiResponse(
            responseCode = "204",
            description = "Logout realizado com sucesso"
    )
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie
                .from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );

        return ResponseEntity.noContent().build();
    }
}