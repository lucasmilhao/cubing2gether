package com.example.teste.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> fazerLoginUsuarioLocal(
            @RequestBody
            @Valid LoginRequestDTO request,
            HttpServletResponse response) {

        LoginResponseDTO result
                = service.login(TypeProvider.LOCAL, request);

        setCookie(result, response);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login/google")
    public ResponseEntity<LoginResponseDTO> fazerLoginUsuarioGoogle(
            @RequestBody String request,
            HttpServletResponse response) {

        LoginResponseDTO result
                = service.login(TypeProvider.GOOGLE, request);

        setCookie(result, response);

        return ResponseEntity.ok(result);
    }

    public void setCookie(LoginResponseDTO result, HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie
                .from("access_token", result.token())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(60 * 60 * 24)
                .build();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookie.toString()
        );

    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> registrarUsuario(
            @RequestBody @Valid UsuarioRequestDTO request, HttpServletResponse response) {

        LoginResponseDTO result
                = service.registrarUsuario(request);

        setCookie(result, response);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result);
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Void> rcuperarSenha(
            @RequestBody UsuarioResponseDTO request) {

        service.solicitarRedefinicao(request.email());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(
            @RequestBody RedefinirSenhaRequestDTO request) {

        service.redefinirSenha(request);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie
                .from("access_token", "")
                .httpOnly(true)
                .secure(true)
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
