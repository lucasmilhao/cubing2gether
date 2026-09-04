package com.example.teste.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.teste.dto.chat.conversa.ConversaRequestDTO;
import com.example.teste.dto.chat.participantes.ParticipantesConversaRequestDTO;
import com.example.teste.exception.UsuarioNaoEncontradoException;
import com.example.teste.model.Conversa;
import com.example.teste.model.ConviteConversa;
import com.example.teste.model.ParticipantesConversa;
import com.example.teste.model.Usuario;
import com.example.teste.repository.ConversaRepository;
import com.example.teste.repository.ConviteRepository;
import com.example.teste.repository.ParticipantesConversaRepository;
import com.example.teste.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class ConversaService {

    @Autowired
    private ConversaRepository conversaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MensagemService mensagemService;

    @Autowired
    private ParticipantesConversaRepository participantesConversaRepository;

    @Autowired
    private ParticipantesConversaService participantesConversaService;

    @Autowired
    private ConviteRepository conviteRepository;

    public Conversa criarConversa(ConversaRequestDTO request) {

        Conversa conversa = new Conversa(request);

        conversaRepository.save(conversa);

        return conversa;
    }

    public void deletarConversa(Conversa c) {
        mensagemService.removerMensagemConversa(c);
        conversaRepository.delete(c);
    }

    public Conversa editarConversa(Conversa c) {
        return conversaRepository.save(c);
    }

    public Conversa editarConversa(String idConversa, ConversaRequestDTO request) {

        Conversa c = getConversaPorId(idConversa);
        c.setIsPublico(request.isPublico());
        c.setNome(request.nome());

        return conversaRepository.save(c);
    }

    public Conversa criarConversaComParticipantes(ConversaRequestDTO request) {
        if (request.idsUsuarios().size() < 3) {
            Optional<Conversa> c = conversaRepository.findConversaByParticipantes(request.idsUsuarios(),
                    (long) request.idsUsuarios().size());

            if (c.isPresent())
                return c.get();
        }
        Conversa conversa = new Conversa(request);
        conversaRepository.save(conversa);

        for (String id : request.idsUsuarios()) {

            Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new UsuarioNaoEncontradoException());

            if (participantesConversaRepository.existsByUsuarioAndConversa(u, conversa))
                throw new RuntimeException("Conversa e usuario já existem");

            ParticipantesConversa pc = new ParticipantesConversa();
            pc.setConversa(conversa);
            pc.setUsuario(u);
            pc.setIsAdmin(false);

            if (id.equals(request.idsUsuarios().getLast()))
                pc.setIsAdmin(true);

            participantesConversaRepository.save(pc);
        }

        return conversa;
    }

    public List<Conversa> getConversaPorIdUsuario(String idUsuario) {
        Usuario u = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());
        List<Conversa> lista = participantesConversaRepository.findByUsuario(u)
                .stream().map(e -> e.getConversa()).toList();

        return lista;
    }

    public Conversa getConversaPorId(String idConversa) {
        Conversa c = conversaRepository.findById(idConversa)
                .orElseThrow(() -> new RuntimeException("Conversa nao encontrada"));
        return c;
    }

    public String gerarToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    @Transactional
    public ConviteConversa criarConvite(String idConversa, String idUsuario) {

        Conversa conversa = conversaRepository
                .findById(idConversa)
                .orElseThrow();

        if (!conversa.getIsPublico())
            throw new RuntimeException("Conversa é privada.");

        Usuario usuario = usuarioRepository
                .findById(idUsuario)
                .orElseThrow();

        ConviteConversa convite = new ConviteConversa();

        convite.setToken(gerarToken());
        convite.setConversa(conversa);
        convite.setCriador(usuario);
        convite.setCriadoEm(Instant.now());

        convite.setExpiraEm(
                Instant.now().plus(24, ChronoUnit.HOURS));

        return conviteRepository.save(convite);
    }

    @Transactional
    public Conversa aceitarConvite(String token, Usuario usuario) {

        ConviteConversa convite = conviteRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Convite inválido"));

        if (convite.getExpiraEm() != null &&
                convite.getExpiraEm().isBefore(Instant.now())) {

            throw new RuntimeException("Convite expirado");
        }

        Conversa conversa = convite.getConversa();

        participantesConversaService.adicionarParticipante(new ParticipantesConversaRequestDTO(conversa.getIdConversa(), usuario.getId()));

        return conversa;
    }

    public ConviteConversa getConversaPorConvite(String token) {
        ConviteConversa convite = conviteRepository.findByToken(token).orElseThrow(() -> new RuntimeException());

        return convite;
    }

    public void removerParticipante(String idConversa, String idUsuario) {
        Usuario u = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNaoEncontradoException());
        Conversa c = conversaRepository.findById(idConversa)
                .orElseThrow(() -> new RuntimeException("Conversa não encontrada"));
        ParticipantesConversa pc = participantesConversaRepository.findByUsuarioAndConversa(u, c);
        pc.setIsAtivo(false);
        participantesConversaRepository.save(pc);

        c.getParticipantes().remove(pc);
        editarConversa(c);
    }
}
