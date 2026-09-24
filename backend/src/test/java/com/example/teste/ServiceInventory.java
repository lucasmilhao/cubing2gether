package com.example.teste;

import com.example.teste.service.AuthService;
import com.example.teste.service.AuthenticationProviderFactory;
import com.example.teste.service.ComentarioService;
import com.example.teste.service.ConversaService;
import com.example.teste.service.CurtidaService;
import com.example.teste.service.DenunciaService;
import com.example.teste.service.EmailService;
import com.example.teste.service.FollowService;
import com.example.teste.service.GoogleAuthenticationService;
import com.example.teste.service.LocalAuthService;
import com.example.teste.service.MensagemService;
import com.example.teste.service.NotificacaoService;
import com.example.teste.service.ParticipantesConversaService;
import com.example.teste.service.PartidaService;
import com.example.teste.service.PartidaUsuarioService;
import com.example.teste.service.PostagemService;
import com.example.teste.service.ScrambleService;
import com.example.teste.service.SolveService;
import com.example.teste.service.UploadService;
import com.example.teste.service.UsuarioService;

final class ServiceInventory {

    private ServiceInventory() {
    }

    static final Class<?>[] SERVICES = {
            AuthService.class,
            AuthenticationProviderFactory.class,
            ComentarioService.class,
            ConversaService.class,
            CurtidaService.class,
            DenunciaService.class,
            EmailService.class,
            FollowService.class,
            GoogleAuthenticationService.class,
            LocalAuthService.class,
            MensagemService.class,
            NotificacaoService.class,
            ParticipantesConversaService.class,
            PartidaService.class,
            PartidaUsuarioService.class,
            PostagemService.class,
            ScrambleService.class,
            SolveService.class,
            UploadService.class,
            UsuarioService.class
    };
}
