package com.example.teste;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import com.example.teste.dto.login.LoginRequestDTO;
import com.example.teste.model.AuthenticationProvider;
import com.example.teste.model.Credential;
import com.example.teste.model.Usuario;
import com.example.teste.repository.UsuarioRepository;
import com.example.teste.service.AuthenticationProviderFactory;
import com.example.teste.service.GoogleAuthenticationService;
import com.example.teste.service.LocalAuthService;
import com.example.teste.service.PartidaService;
import com.example.teste.service.SolveService;
import com.example.teste.repository.PartidaRepository;
import com.example.teste.repository.SolveRepository;
import com.example.teste.type.TypeProvider;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

class ServiceLayerTest {

    @Test
    void everyBackendServiceIsRegisteredAndExposesOperations() {
        for (Class<?> serviceType : ServiceInventory.SERVICES) {
            assertNotNull(serviceType.getAnnotation(Service.class), serviceType.getSimpleName());
            assertNotNull(serviceType.getDeclaredMethods()[0], serviceType.getSimpleName());
        }
    }

    @Test
    void authenticationProviderFactoryReturnsRegisteredProvider() {
        AuthenticationProvider<?> provider = mock(AuthenticationProvider.class);
        when(provider.getProvider()).thenReturn(TypeProvider.LOCAL);

        AuthenticationProviderFactory factory = new AuthenticationProviderFactory(List.of(provider));

        assertEquals(provider, factory.get(TypeProvider.LOCAL));
        assertThrows(IllegalArgumentException.class, () -> factory.get(TypeProvider.GOOGLE));
    }

    @Test
    void localAuthenticationReturnsAuthenticatedUserForValidCredentials() {
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        UsuarioRepository repository = mock(UsuarioRepository.class);
        Usuario user = new Usuario();
        user.setId("user-id");
        user.setEmail("user@example.com");
        user.setNome("User");
        Credential credential = new Credential();
        credential.setProvider(TypeProvider.LOCAL);
        credential.setPasswordHash("encoded");
        user.setCredentials(List.of(credential));

        when(repository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(encoder.matches("password", "encoded")).thenReturn(true);

        LocalAuthService service = new LocalAuthService(encoder, repository);

        assertEquals("user@example.com",
                service.authenticate(new LoginRequestDTO("user@example.com", "password")).email());
        assertEquals(TypeProvider.LOCAL, service.getProvider());
    }

    @Test
    void googleAuthenticationServiceReportsGoogleProvider() {
        GoogleAuthenticationService service = new GoogleAuthenticationService();

        assertEquals(TypeProvider.GOOGLE, service.getProvider());
    }

    @Test
    void partidaServiceReturnsAllPartidasFromRepository() {
        PartidaRepository repository = mock(PartidaRepository.class);
        List<com.example.teste.model.Partida> partidas = new ArrayList<>();
        when(repository.findAll()).thenReturn(partidas);
        PartidaService service = new PartidaService();
        ReflectionTestUtils.setField(service, "partidaRepository", repository);

        assertEquals(partidas, service.getTodas());
    }

    @Test
    void solveServiceReturnsNullWhenThereAreNoSolves() {
        SolveRepository repository = mock(SolveRepository.class);
        when(repository.findAll()).thenReturn(List.of());
        SolveService service = new SolveService();
        ReflectionTestUtils.setField(service, "solveRepository", repository);

        assertNull(service.getTodasSolves());
    }
}