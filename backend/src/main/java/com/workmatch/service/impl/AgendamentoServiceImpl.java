package com.workmatch.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.workmatch.model.Agendamento;
import com.workmatch.model.Profissional;
import com.workmatch.repository.AgendamentoRepository;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.service.AgendamentoService;

@Service
public class AgendamentoServiceImpl implements AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ProfissionalRepository profissionalRepository;

    public AgendamentoServiceImpl(AgendamentoRepository agendamentoRepository,
                                 ProfissionalRepository profissionalRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.profissionalRepository = profissionalRepository;
    }

    @Override
    public Agendamento criar(Agendamento agendamento) {

        Profissional profissional = profissionalRepository.findById(
                agendamento.getProfissional().getId()
        ).orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        agendamento.setProfissional(profissional);

        boolean existe = agendamentoRepository
                .existsByProfissionalIdAndDataAndHorario(
                        profissional.getId(),
                        agendamento.getData(),
                        agendamento.getHorario()
                );

        if (existe) {
            throw new RuntimeException("Horário já ocupado");
        }

        return agendamentoRepository.save(agendamento);
    }

    @Override
    public List<Agendamento> meusAgendamentos(UUID usuarioId) {
        return agendamentoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public void deletar(UUID id, UUID usuarioId) {

        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!agendamento.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Sem permissão para excluir este agendamento");
        }

        agendamentoRepository.delete(agendamento);
    }
}