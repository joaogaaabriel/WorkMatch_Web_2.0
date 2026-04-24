package com.workmatch.service.impl;

import com.workmatch.dto.request.AgendaRequest;
import com.workmatch.dto.response.AgendaResponse;
import com.workmatch.model.Agenda;
import com.workmatch.model.AgendaHorario;
import com.workmatch.model.Profissional;
import com.workmatch.repository.AgendaHorariosRepository;
import com.workmatch.repository.AgendaRepository;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.service.AgendaService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AgendaServiceImpl implements AgendaService {

    private final AgendaRepository agendaRepo;
    private final AgendaHorariosRepository horariosRepo;
    private final ProfissionalRepository profissionalRepo;

    public AgendaServiceImpl(
            AgendaRepository agendaRepo,
            AgendaHorariosRepository horariosRepo,
            ProfissionalRepository profissionalRepo) {
        this.agendaRepo = agendaRepo;
        this.horariosRepo = horariosRepo;
        this.profissionalRepo = profissionalRepo;
    }

    @Override
    @Transactional
    public UUID criar(UUID profissionalId, AgendaRequest request) {
        Profissional profissional = profissionalRepo.findById(profissionalId)
                .orElseThrow(() -> new IllegalArgumentException("Profissional não encontrado"));

        LocalDate data = LocalDate.parse(request.getData());

        if (agendaRepo.existsByProfissionalIdAndData(profissionalId, data)) {
            throw new IllegalArgumentException("Já existe uma agenda para este profissional nesta data");
        }

        Agenda agenda = new Agenda();
        agenda.setData(data);
        agenda.setProfissional(profissional);
        agenda = agendaRepo.save(agenda);

        salvarHorarios(agenda, request.getHorarios());

        return agenda.getId();
    }

    @Override
    @Transactional
    public void atualizar(UUID agendaId, AgendaRequest request) {
        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new IllegalArgumentException("Agenda não encontrada"));

        agenda.setData(LocalDate.parse(request.getData()));
        agendaRepo.save(agenda);

        horariosRepo.deleteByAgendaId(agendaId);
        salvarHorarios(agenda, request.getHorarios());
    }

    @Override
    @Transactional
    public void deletar(UUID agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new IllegalArgumentException("Agenda não encontrada"));

        horariosRepo.deleteByAgendaId(agendaId);
        agendaRepo.delete(agenda);
    }

    @Override
    @Transactional(readOnly = true)
    public AgendaResponse buscarPorId(UUID agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId)
                .orElseThrow(() -> new IllegalArgumentException("Agenda não encontrada"));

        List<String> horarios = horariosRepo.findByAgendaId(agendaId)
                .stream()
                .map(AgendaHorario::getHorario)
                .toList();

        return new AgendaResponse(agenda.getId(), agenda.getData(), horarios);
    }

    private void salvarHorarios(Agenda agenda, List<String> horarios) {

        List<String> lista = Optional.ofNullable(horarios)
                .orElse(List.of());

        lista.forEach(hr -> {
            AgendaHorario h = new AgendaHorario();
            h.setHorario(hr);
            h.setAgenda(agenda);
            horariosRepo.save(h);
        });
    }
}