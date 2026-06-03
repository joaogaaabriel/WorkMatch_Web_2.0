package com.workmatch.service;

import com.workmatch.dto.CandidatureDTO;
import com.workmatch.dto.MenssengerDTO;
import com.workmatch.dto.response.CandidatureResponse;
import com.workmatch.model.Candidature;
import com.workmatch.model.Profissional;
import com.workmatch.model.Servico;
import com.workmatch.model.Usuario;
import com.workmatch.repository.CandidatureRepository;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.repository.ServicoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final ServicoRepository servicoRepository;
    private final ProfissionalRepository profissionalRepository;
    private final MenssengerService menssengerService;

    public CandidatureService(
            CandidatureRepository candidatureRepository,
            ServicoRepository servicoRepository,
            ProfissionalRepository profissionalRepository,
            MenssengerService menssengerService
    ) {
        this.candidatureRepository = candidatureRepository;
        this.servicoRepository = servicoRepository;
        this.profissionalRepository = profissionalRepository;
        this.menssengerService = menssengerService;
    }

    public CandidatureResponse criar(CandidatureDTO dto) {

        if (candidatureRepository.existsByServicoIdAndProfissionalId(
                dto.getServicoId(),
                dto.getProfissionalId()
        )) {
            throw new RuntimeException(
                    "Você já se candidatou para este serviço."
            );
        }

        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Serviço não encontrado: " + dto.getServicoId()
                        )
                );

        Profissional profissional = profissionalRepository.findById(
                        dto.getProfissionalId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Profissional não encontrado: " + dto.getProfissionalId()
                        )
                );

        Candidature candidatura = new Candidature();

        candidatura.setServico(servico);
        candidatura.setProfissional(profissional);

        candidatura = candidatureRepository.save(candidatura);

        MenssengerDTO mensagem = new MenssengerDTO();

        mensagem.setServicoId(servico.getId());
        mensagem.setRemetenteId(profissional.getId());

        Usuario cliente = servico.getCliente();

        mensagem.setDestinatarioId(cliente.getId());

        mensagem.setConteudo(
                "Olá, me candidatei para este serviço e estou disponível para conversar."
        );

        menssengerService.enviar(mensagem);

        return new CandidatureResponse(
                candidatura.getId(),
                servico.getId(),
                profissional.getId(),
                profissional.getNome(),
                profissional.getEspecialidade(),
                profissional.getCidade(),
                profissional.getEstado(),
                candidatura.getCriadoEm()
        );
    }

    public List<CandidatureResponse> listarPorServico(UUID servicoId) {

        return candidatureRepository
                .findByServicoId(servicoId)
                .stream()
                .map(c -> new CandidatureResponse(
                        c.getId(),
                        c.getServico().getId(),
                        c.getProfissional().getId(),
                        c.getProfissional().getNome(),
                        c.getProfissional().getEspecialidade(),
                        c.getProfissional().getCidade(),
                        c.getProfissional().getEstado(),
                        c.getCriadoEm()
                ))
                .toList();
    }
}