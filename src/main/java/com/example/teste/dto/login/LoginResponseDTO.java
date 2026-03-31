package com.example.teste.dto.login;

import com.example.teste.dto.usuario.UsuarioResponseDTO;

public record LoginResponseDTO(UsuarioResponseDTO response, String token) {
    
}
