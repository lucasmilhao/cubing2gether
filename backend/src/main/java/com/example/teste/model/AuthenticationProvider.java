package com.example.teste.model;

import com.example.teste.dto.usuario.AuthenticatedUserDTO;

public interface AuthenticationProvider<E> {
    TypeProvider getProvider();

    AuthenticatedUserDTO authenticate(E credential);
}
