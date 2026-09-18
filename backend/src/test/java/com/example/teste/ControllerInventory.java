package com.example.teste;

import com.example.teste.controller.AuthController;
import com.example.teste.controller.ComentarioController;
import com.example.teste.controller.ConversaController;
import com.example.teste.controller.CurtidaController;
import com.example.teste.controller.DenunciaController;
import com.example.teste.controller.FollowController;
import com.example.teste.controller.MensagemController;
import com.example.teste.controller.NotificacaoController;
import com.example.teste.controller.ParticipantesConversaController;
import com.example.teste.controller.PartidaController;
import com.example.teste.controller.PartidaUsuarioController;
import com.example.teste.controller.PostagemController;
import com.example.teste.controller.ScramblesController;
import com.example.teste.controller.SolveController;
import com.example.teste.controller.UploadController;
import com.example.teste.controller.UsuarioController;

final class ControllerInventory {

    private ControllerInventory() {
    }

    static final Class<?>[] CONTROLLERS = {
            AuthController.class,
            ComentarioController.class,
            ConversaController.class,
            CurtidaController.class,
            DenunciaController.class,
            FollowController.class,
            MensagemController.class,
            NotificacaoController.class,
            ParticipantesConversaController.class,
            PartidaController.class,
            PartidaUsuarioController.class,
            PostagemController.class,
            ScramblesController.class,
            SolveController.class,
            UploadController.class,
            UsuarioController.class
    };
}
