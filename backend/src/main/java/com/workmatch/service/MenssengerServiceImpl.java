package com.workmatch.service;

import com.workmatch.dto.MenssengerDTO;
import com.workmatch.dto.response.MenssengerResponse;
import com.workmatch.model.Menssenger;
import com.workmatch.model.Profissional;
import com.workmatch.model.Servico;
import com.workmatch.model.Usuario;
import com.workmatch.repository.CandidatureRepository;
import com.workmatch.repository.MenssengerRepository;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.repository.ServicoRepository;
import com.workmatch.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MenssengerServiceImpl extends MenssengerService {

    private final MenssengerRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final ServicoRepository servicoRepository;
    private final CandidatureRepository candidatureRepository;
    private final ProfissionalRepository profissionalRepository;

    public MenssengerServiceImpl(
            MenssengerRepository repository,
            UsuarioRepository usuarioRepository,
            ServicoRepository servicoRepository,
            CandidatureRepository candidatureRepository,
            ProfissionalRepository profissionalRepository
    ) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.servicoRepository = servicoRepository;
        this.candidatureRepository = candidatureRepository;
        this.profissionalRepository = profissionalRepository;
    }

    @Override
    public MenssengerResponse enviar(MenssengerDTO dto) {

        Servico servico = servicoRepository
                .findById(dto.getServicoId())
                .orElseThrow(() ->
                        new RuntimeException("Serviço não encontrado")
                );

        Profissional remetente = profissionalRepository
                .findById(dto.getRemetenteId())
                .orElseThrow(() ->
                        new RuntimeException("Profissional não encontrado")
                );

        Usuario destinatario = usuarioRepository
                .findById(dto.getDestinatarioId())
                .orElseThrow(() ->
                        new RuntimeException("Destinatário não encontrado")
                );

        boolean possuiCandidatura =
                candidatureRepository.existsByServicoIdAndProfissionalId(
                        dto.getServicoId(),
                        dto.getRemetenteId()
                );

        if (!possuiCandidatura) {
            throw new RuntimeException(
                    "Você não pode conversar neste serviço."
            );
        }

        Menssenger mensagem = new Menssenger();

        mensagem.setServico(servico);
        mensagem.setRemetente(remetente);
        mensagem.setDestinatario(destinatario);
        mensagem.setConteudo(dto.getConteudo());

        mensagem = repository.save(mensagem);

        MenssengerResponse response = new MenssengerResponse();

        response.setId(mensagem.getId());
        response.setServicoId(servico.getId());
        response.setRemetenteId(remetente.getId());
        response.setRemetenteNome(remetente.getNome());
        response.setDestinatarioId(destinatario.getId());
        response.setConteudo(mensagem.getConteudo());
        response.setEnviadoEm(mensagem.getEnviadoEm());

        return response;
    }

    @Override
    public List<MenssengerResponse> listarPorServico(UUID servicoId) {

        return repository
                .findByServicoIdOrderByEnviadoEmAsc(servicoId)
                .stream()
                .map(m -> {

                    MenssengerResponse r = new MenssengerResponse();

                    r.setId(m.getId());
                    r.setServicoId(m.getServico().getId());
                    r.setRemetenteId(m.getRemetente().getId());
                    r.setRemetenteNome(m.getRemetente().getNome());
                    r.setDestinatarioId(m.getDestinatario().getId());
                    r.setConteudo(m.getConteudo());
                    r.setEnviadoEm(m.getEnviadoEm());

                    return r;
                })
                .toList();
    }
}