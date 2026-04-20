package com.workmatch.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.workmatch.model.Agenda;
import com.workmatch.model.AgendaHorarios;
import com.workmatch.model.Agendamentos;
import com.workmatch.repository.AgendaHorariosRepository;
import com.workmatch.repository.AgendaRepository;
import com.workmatch.repository.AgendamentoRepository;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalAgendaController {

    private final AgendaRepository agendaRepo;
    private final AgendaHorariosRepository horariosRepo;
    private final AgendamentoRepository agendamentoRepo;

    public ProfissionalAgendaController(
            AgendaRepository agendaRepo,
            AgendaHorariosRepository horariosRepo,
            AgendamentoRepository agendamentoRepo) {
        this.agendaRepo = agendaRepo;
        this.horariosRepo = horariosRepo;
        this.agendamentoRepo = agendamentoRepo;
    }

    @GetMapping("/{id}/agendas")
    public ResponseEntity<?> listarAgendamentos(
            @PathVariable UUID id,
            @RequestParam String data) {

        LocalDate dataSelecionada;
        try {
            dataSelecionada = LocalDate.parse(data);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Formato de data inválido. Use YYYY-MM-DD"));
        }

        Agenda agenda = agendaRepo.findByProfissionalIdAndData(id, dataSelecionada).orElse(null);
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

        List<String> ocupados = agendamentoRepo
                .findByProfissionalIdAndData(id, dataSelecionada)
                .stream()
                .map(Agendamentos::getHorario)
                .filter(Objects::nonNull)
                .map(h -> String.format("%02d:%02d", h.getHour(), h.getMinute()))
                .toList();

        return ResponseEntity.ok(Map.of(
                "horarios", horarios,
                "ocupados", ocupados
        ));
    }

    @PostMapping("/agendas/{agendaId}/horarios")
    @Transactional
    public ResponseEntity<?> adicionarHorarios(
            @PathVariable UUID agendaId,
            @RequestBody Map<String, List<String>> body) {

        List<String> novosHorarios = body.get("horarios");
        if (novosHorarios == null || novosHorarios.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Lista de horários não pode ser vazia"));
        }

        Agenda agenda = agendaRepo.findById(agendaId).orElse(null);
        if (agenda == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Agenda não encontrada"));
        }

        List<String> horariosExistentes = horariosRepo.findByAgendaId(agendaId)
                .stream()
                .map(AgendaHorarios::getHorario)
                .toList();

        List<String> horariosDuplicados = novosHorarios.stream()
                .filter(horariosExistentes::contains)
                .toList();

        if (!horariosDuplicados.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "error", "Horários já cadastrados para esta agenda",
                            "duplicados", horariosDuplicados
                    ));
        }

        for (String hr : novosHorarios) {
            AgendaHorarios ah = new AgendaHorarios();
            ah.setHorario(hr);
            ah.setAgenda(agenda);
            horariosRepo.save(ah);
        }

        return ResponseEntity.ok(Map.of("mensagem", "Horários adicionados com sucesso"));
    }
}