package com.example.teste.model;

import com.example.teste.dto.usuario.AuthenticatedUserDTO;
import com.example.teste.type.TypeProvider;

public interface AuthenticationProvider<E> {
    TypeProvider getProvider();

    AuthenticatedUserDTO authenticate(E credential);
}
