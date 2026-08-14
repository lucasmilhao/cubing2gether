package com.example.teste.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Cubing2Gether API")
                        .description("""
                                API REST da plataforma Cubing2Gether.

                                A API fornece funcionalidades relacionadas a:
                                - Autenticação e cadastro de usuários
                                - Usuários
                                - Postagens
                                - Curtidas e denúncias
                                - Seguidores
                                - Conversas e mensagens
                                - Notificações
                                - Scrambles
                                - Solves
                                - Partidas
                                - Upload de arquivos
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Cubing2Gether")
                                .email("contato@cubing2gether.com"))
                        .license(new License()
                                .name("MIT License")))
                .components(new Components()
                        .addSecuritySchemes(
                                "cookieAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.COOKIE)
                                        .name("access_token")
                                        .description(
                                                "Token JWT armazenado no cookie HTTP-only access_token.")));
    }
}