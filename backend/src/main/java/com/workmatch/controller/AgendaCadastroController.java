package com.workmatch.controller;

import com.workmatch.dto.AgendaRequest;
import com.workmatch.model.Agenda;
import com.workmatch.model.AgendaHorarios;
import com.workmatch.model.Profissional;
import com.workmatch.repository.AgendaHorariosRepository;
import com.workmatch.repository.AgendaRepository;
import com.workmatch.repository.AgendamentoRepository;
import com.workmatch.repository.ProfissionalRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/agendas")
public class AgendaCadastroController {

    private final AgendaRepository agendaRepo;
    private final AgendaHorariosRepository horariosRepo;
    private final ProfissionalRepository profissionalRepo;
    private final AgendamentoRepository agendamentosRepo;

    public AgendaCadastroController(
            AgendaRepository agendaRepo,
            AgendaHorariosRepository horariosRepo,
            ProfissionalRepository profissionalRepo,
            AgendamentoRepository agendamentosRepo) {
        this.agendaRepo = agendaRepo;
        this.horariosRepo = horariosRepo;
        this.profissionalRepo = profissionalRepo;
        this.agendamentosRepo = agendamentosRepo;
    }

    @PostMapping("/{profissionalId}")
    @Transactional
    public ResponseEntity<?> criarAgenda(
            @PathVariable UUID profissionalId,
            @RequestBody AgendaRequest request) {

        if (request == null || request.getData() == null
                || request.getHorarios() == null || request.getHorarios().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Data e horários são obrigatórios"));
        }

        Profissional profissional = profissionalRepo.findById(profissionalId)
                .orElse(null);
        if (profissional == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Profissional não encontrado"));
        }

        LocalDate data;
        try {
            data = LocalDate.parse(request.getData());
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Formato de data inválido"));
        }

        if (agendaRepo.existsByProfissionalIdAndData(profissional.getId(), data)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Já existe uma agenda para este profissional nesta data"));
        }

        Agenda agenda = new Agenda();
        agenda.setData(data);
        agenda.setProfissional(profissional);
        agenda = agendaRepo.save(agenda);

        for (String hr : request.getHorarios()) {
            AgendaHorarios h = new AgendaHorarios();
            h.setHorario(hr);
            h.setAgenda(agenda);
            horariosRepo.save(h);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensagem", "Agenda e horários cadastrados com sucesso"));
    }

    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<?> listarAgendasPorProfissional(@PathVariable UUID profissionalId) {
        List<Agenda> agendas = agendaRepo.findByProfissionalId(profissionalId);

        List<Map<String, Object>> resposta = agendas.stream()
                .map(a -> Map.of(
                        "agendaId", a.getId(),
                        "data", a.getData(),
                        "horarios", horariosRepo.findByAgendaId(a.getId())
                                .stream()
                                .map(h -> Map.of(
                                        "id", h.getId(),
                                        "horario", h.getHorario()
                                ))
                                .toList()
                ))
                .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{agendaId}")
    public ResponseEntity<?> buscarAgendaPorId(@PathVariable UUID agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId).orElse(null);
        if (agenda == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Agenda não encontrada"));
        }

        List<String> horarios = horariosRepo.findByAgendaId(agenda.getId())
                .stream()
                .map(AgendaHorarios::getHorario)
                .toList();

        return ResponseEntity.ok(Map.of(
                "agendaId", agenda.getId(),
                "data", agenda.getData(),
                "horarios", horarios
        ));
    }

    @GetMapping("/profissionais/{profissionalId}/agendas")
    public ResponseEntity<?> listarHorariosPorDia(
            @PathVariable UUID profissionalId,
            @RequestParam String data) {

        LocalDate dia;
        try {
            dia = LocalDate.parse(data);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Formato de data inválido"));
        }

        Agenda agenda = agendaRepo.findByProfissionalIdAndData(profissionalId, dia)
                .orElse(null);

        if (agenda == null) {
            return ResponseEntity.ok(Map.of(
                    "horarios", List.of(),
                    "ocupados", List.of()
            ));
        }

        List<String> horarios = horariosRepo.findByAgendaId(agenda.getId())
                .stream()
                .map(AgendaHorarios::getHorario)
                .toList();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");
        List<String> ocupados = agendamentosRepo.findByProfissionalIdAndData(profissionalId, dia)
                .stream()
                .map(a -> a.getHorario().format(fmt))
                .toList();

        return ResponseEntity.ok(Map.of(
                "horarios", horarios,
                "ocupados", ocupados
        ));
    }

    @PutMapping("/{agendaId}")
    @Transactional
    public ResponseEntity<?> atualizarAgenda(
            @PathVariable UUID agendaId,
            @RequestBody AgendaRequest request) {

        if (request == null || request.getData() == null
                || request.getHorarios() == null || request.getHorarios().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Data e horários são obrigatórios"));
        }

        Agenda agenda = agendaRepo.findById(agendaId).orElse(null);
        if (agenda == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Agenda não encontrada"));
        }

        LocalDate data;
        try {
            data = LocalDate.parse(request.getData());
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Formato de data inválido"));
        }

        agenda.setData(data);
        agendaRepo.save(agenda);

        horariosRepo.deleteByAgendaId(agendaId);
        for (String hr : request.getHorarios()) {
            AgendaHorarios h = new AgendaHorarios();
            h.setHorario(hr);
            h.setAgenda(agenda);
            horariosRepo.save(h);
        }

        return ResponseEntity.ok(Map.of("mensagem", "Agenda atualizada com sucesso"));
    }

    @DeleteMapping("/{agendaId}")
    @Transactional
    public ResponseEntity<?> excluirAgenda(@PathVariable UUID agendaId) {
        Agenda agenda = agendaRepo.findById(agendaId).orElse(null);
        if (agenda == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Agenda não encontrada"));
        }

        horariosRepo.deleteByAgendaId(agendaId);
        agendaRepo.delete(agenda);

        return ResponseEntity.ok(Map.of("mensagem", "Agenda excluída com sucesso"));
    }

    @DeleteMapping("/{agendaId}/horarios/{horarioId}")
    @Transactional
    public ResponseEntity<?> excluirHorario(
            @PathVariable UUID agendaId,
            @PathVariable UUID horarioId) {

        AgendaHorarios horario = horariosRepo.findById(horarioId).orElse(null);
        if (horario == null || !horario.getAgenda().getId().equals(agendaId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Horário não encontrado"));
        }

        horariosRepo.delete(horario);
        return ResponseEntity.ok(Map.of("mensagem", "Horário excluído com sucesso"));
    }
}