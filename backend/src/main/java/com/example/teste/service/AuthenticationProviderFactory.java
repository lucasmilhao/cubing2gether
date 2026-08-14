package com.example.teste.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.teste.model.AuthenticationProvider;
import com.example.teste.type.TypeProvider;

@Service
public class AuthenticationProviderFactory {

    private final Map<TypeProvider, AuthenticationProvider<?>> providers;

    public AuthenticationProviderFactory(
            List<AuthenticationProvider<?>> providerList) {

        this.providers = providerList.stream()
                .collect(Collectors.toMap(
                        AuthenticationProvider::getProvider,
                        Function.identity()
                ));
    }

    @SuppressWarnings("unchecked")
    public <T> AuthenticationProvider<T> get(TypeProvider provider) {

        AuthenticationProvider<?> authenticationProvider =
                providers.get(provider);

        if (authenticationProvider == null) {
            throw new IllegalArgumentException(
                    "Provider não suportado: " + provider
            );
        }

        return (AuthenticationProvider<T>) authenticationProvider;
    }

}