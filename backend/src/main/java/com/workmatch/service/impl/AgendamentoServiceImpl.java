package com.workmatch.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.workmatch.dto.request.AgendamentoRequest;
import com.workmatch.dto.response.AgendamentoResponse;
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

    public AgendamentoResponse criar(AgendamentoRequest request) {

        Profissional profissional = profissionalRepository.findById(request.getProfissionalId())
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        boolean existe = agendamentoRepository
                .existsByProfissionalIdAndDataAndHorario(
                        profissional.getId(),
                        request.getData(),
                        request.getHorario()
                );

        if (existe) {
            throw new RuntimeException("Horário já ocupado");
        }

        Agendamento agendamento = new Agendamento();
        agendamento.setData(request.getData());
        agendamento.setHorario(request.getHorario());
        agendamento.setProfissional(profissional);

        Agendamento salvo = agendamentoRepository.save(agendamento);

        return new AgendamentoResponse(
                salvo.getId(),
                salvo.getUsuario().getId(),
                salvo.getProfissional().getId(),
                salvo.getData(),
                salvo.getHorario()
        );
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