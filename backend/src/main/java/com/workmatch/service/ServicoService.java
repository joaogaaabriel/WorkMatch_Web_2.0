package com.workmatch.service;

import com.workmatch.dto.ServicoDTO;
import com.workmatch.dto.response.CandidatureResponse;
import com.workmatch.dto.response.ServicoResponse;
import com.workmatch.model.Profissional;
import com.workmatch.model.Servico;
import com.workmatch.model.StatusServico;
import com.workmatch.model.Usuario;
import com.workmatch.repository.CandidatureRepository;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.repository.ServicoRepository;
import com.workmatch.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProfissionalRepository profissionalRepository;
    private final MapperService mapper;
    private final CandidatureRepository candidatureRepository;

    public ServicoService(
            ServicoRepository servicoRepository,
            UsuarioRepository usuarioRepository,
            ProfissionalRepository profissionalRepository,
            MapperService mapper,
            CandidatureRepository candidatureRepository
    ) {
        this.servicoRepository = servicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.profissionalRepository = profissionalRepository;
        this.mapper = mapper;
        this.candidatureRepository = candidatureRepository;
    }

    @Transactional
    public ServicoResponse criar(ServicoDTO dto) {

        Usuario cliente = usuarioRepository
                .findById(dto.clienteId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado"));

        Servico servico = new Servico();

        servico.setTitulo(dto.titulo());
        servico.setEspecialidade(dto.especialidade());
        servico.setDescricao(dto.descricao());
        servico.setCliente(cliente);
        servico.setStatus(StatusServico.PUBLICADO);

        return mapper.toResponse(
                servicoRepository.save(servico)
        );
    }

    public ServicoResponse buscarPorId(UUID id) {
        return mapper.toResponse(
                buscarEntidade(id)
        );
    }

    public List<ServicoResponse> listarPorCliente(
            UUID clienteId,
            StatusServico status
    ) {

        List<Servico> servicos = status != null
                ? servicoRepository.findByClienteIdAndStatus(clienteId, status)
                : servicoRepository.findByClienteId(clienteId);

        return servicos
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ServicoResponse> listarPorProfissional(
            UUID profissionalId,
            StatusServico status
    ) {

        List<Servico> servicos = status != null
                ? servicoRepository.findByProfissionalIdAndStatus(
                profissionalId,
                status
        )
                : servicoRepository.findByProfissionalId(profissionalId);

        return servicos
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ServicoResponse> listarPublicados(
            String especialidade,
            String cidade
    ) {

        if (especialidade != null) {
            return servicoRepository
                    .findByEspecialidadeContainingIgnoreCaseAndStatus(
                            especialidade,
                            StatusServico.PUBLICADO
                    )
                    .stream()
                    .map(mapper::toResponse)
                    .toList();
        }

        if (cidade != null) {
            return servicoRepository
                    .findByCidadeContainingIgnoreCaseAndStatus(
                            cidade,
                            StatusServico.PUBLICADO
                    )
                    .stream()
                    .map(mapper::toResponse)
                    .toList();
        }

        return servicoRepository
                .findByStatus(StatusServico.PUBLICADO)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public ServicoResponse avancarStatus(
            UUID id,
            UUID profissionalId
    ) {

        Servico servico = buscarEntidade(id);

        StatusServico proximo =
                proximoStatus(servico.getStatus());

        if (
                proximo == StatusServico.NEGOCIANDO ||
                        proximo == StatusServico.CONTRATADO
        ) {

            Profissional profissional =
                    profissionalRepository
                            .findById(profissionalId)
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Profissional não encontrado"
                                    ));

            servico.setProfissional(profissional);
        }

        servico.setStatus(proximo);

        return mapper.toResponse(
                servicoRepository.save(servico)
        );
    }

    @Transactional
    public void cancelar(UUID id) {

        Servico servico = buscarEntidade(id);

        if (servico.getStatus() == StatusServico.FINALIZADO) {
            throw new IllegalStateException(
                    "Serviço finalizado não pode ser cancelado"
            );
        }

        servicoRepository.deleteById(id);
    }

    private Servico buscarEntidade(UUID id) {

        return servicoRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Serviço não encontrado"
                        ));
    }

    private StatusServico proximoStatus(
            StatusServico atual
    ) {

        return switch (atual) {

            case PUBLICADO ->
                    StatusServico.NEGOCIANDO;

            case NEGOCIANDO ->
                    StatusServico.CONTRATADO;

            case CONTRATADO ->
                    StatusServico.ANDAMENTO;

            case ANDAMENTO ->
                    StatusServico.FINALIZADO;

            case FINALIZADO ->
                    throw new IllegalStateException(
                            "Serviço já finalizado"
                    );
        };
    }

    public List<CandidatureResponse> listarPorServico(
            UUID servicoId
    ) {

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