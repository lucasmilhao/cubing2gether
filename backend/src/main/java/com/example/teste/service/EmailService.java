package com.example.teste.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {


    private final JavaMailSender mailSender;

    private String frontendUrl = "http://localhost:5173";

    public void enviarEmailRedefinicao(String email, String token) {

        String link = frontendUrl + "/redefinir-senha?token=" + token;

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setTo(email);
        mensagem.setSubject("Redefinição de senha");
        mensagem.setText("""
                Olá!

                Recebemos uma solicitação para redefinir sua senha.

                Clique no link abaixo para criar uma nova senha:

                %s

                Este link é válido por 15 minutos.

                Se você não solicitou a redefinição de senha, ignore este e-mail.

                Atenciosamente,
                equipe Cubing2gether.
                """.formatted(link));

        mailSender.send(mensagem);
    }
}
