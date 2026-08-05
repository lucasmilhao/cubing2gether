package com.example.teste.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.teste.dto.login.LoginRequestDTO;
import com.example.teste.dto.login.LoginResponseDTO;
import com.example.teste.dto.usuario.UsuarioRequestDTO;
import com.example.teste.model.TypeProvider;
import com.example.teste.service.AuthService;
import com.google.common.net.HttpHeaders;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private AuthService service;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> fazerLoginUsuarioLocal(@RequestBody LoginRequestDTO request, HttpServletResponse response) {
        LoginResponseDTO result = service.login(TypeProvider.LOCAL, request);

        ResponseCookie cookie = ResponseCookie
        .from("access_token", result.token())
        .httpOnly(true)
        .secure(false)
        .sameSite("Lax")
        .path("/")
        .maxAge(60 * 60 * 24)
        .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/login/google")
    public ResponseEntity<LoginResponseDTO> fazerLoginUsuarioGoogle(@RequestBody String request, HttpServletResponse response) {
        LoginResponseDTO result = service.login(TypeProvider.GOOGLE, request);
        
        ResponseCookie cookie = ResponseCookie
        .from("access_token", result.token())
        .httpOnly(true)
        .secure(false)
        .sameSite("Lax")
        .path("/")
        .maxAge(60 * 60 * 24)
        .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> registrarUsuario(@RequestBody @Valid UsuarioRequestDTO request) {
        LoginResponseDTO response = service.registrarUsuario(request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    // @PostMapping("/guest")
    // public ResponseEntity<LoginResponseDTO> registrarConvidado() {
    //     LoginResponseDTO response = service.registrarConvidado();

    //     return ResponseEntity.status(HttpStatus.CREATED).body(response);
    // }


}
