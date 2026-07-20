package com.example.teste.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teste.model.Credential;
import com.example.teste.model.TypeProvider;

public interface CredentialRepository extends JpaRepository<Credential, String> {
    
    Optional<Credential> findByProviderAndExternalId(TypeProvider provider, String externalId);

}
