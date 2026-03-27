package com.workmatch.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workmatch.model.Agenda;
import com.workmatch.model.AgendaHorarios;
import com.workmatch.model.Agendamentos;
import com.workmatch.repository.AgendaHorariosRepository;
import com.workmatch.repository.AgendaRepository;
import com.workmatch.repository.AgendamentoRepository;

@RestController
@RequestMapping("/api/profissionais")
@CrossOrigin("*")
public class ProfissionalAgendaController {

    @Autowired
    private AgendaRepository agendaRepo;

    @Autowired
    private AgendaHorariosRepository horariosRepo;

    // BUG 008 CORRIGIDO: injetado AgendamentoRepository para buscar horários ocupados
    @Autowired
    private AgendamentoRepository agendamentoRepo;

    // =========================
    // 🔹 LISTAR AGENDA + HORÁRIOS (com ocupados corretos)
    // =========================
    @GetMapping("/{id}/agendas")
    public ResponseEntity<?> listarAgendamentos(
            @PathVariable UUID id,
            @RequestParam String data) {
        try {
            LocalDate dataSelecionada;
            try {
                dataSelecionada = LocalDate.parse(data);
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Formato de data inválido. Use YYYY-MM-DD"));
            }

            Optional<Agenda> agendaOpt = agendaRepo.findByProfissionalIdAndData(id, dataSelecionada);

            // Sem agenda configurada para este dia
            if (agendaOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "horarios", List.of(),
                        "ocupados", List.of()
                ));
            }

            Agenda agenda = agendaOpt.get();

            // Todos os horários configurados para o dia
            List<String> horarios = horariosRepo.findByAgendaId(agenda.getId())
                    .stream()
                    .map(AgendaHorarios::getHorario)
                    .toList();

            // BUG 008 FIX: buscar agendamentos CONFIRMADOS para este profissional nesta data
            // e extrair os horários já ocupados
            List<String> ocupados = agendamentoRepo
                    .findByProfissionalIdAndData(id, dataSelecionada)
                    .stream()
                    .map(Agendamentos::getHorario)   // LocalTime
                    .filter(Objects::nonNull)
                    .map(h -> String.format("%02d:%02d", h.getHour(), h.getMinute()))
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "horarios", horarios,
                    "ocupados", ocupados         // ← agora retorna real, não List.of()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Erro ao listar agendamentos",
                            "details", e.getMessage()
                    ));
        }
    }

    // =========================
    // 🔹 ADICIONAR HORÁRIOS (sem alterações)
    // =========================
    @PostMapping("/agendas/{agendaId}/horarios")
    public ResponseEntity<?> adicionarHorarios(
            @PathVariable UUID agendaId,
            @RequestBody Map<String, List<String>> body) {
        try {
            List<String> novosHorarios = body.get("horarios");
            if (novosHorarios == null || novosHorarios.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Lista de horários não pode ser vazia"));
            }

            Optional<Agenda> agendaOpt = agendaRepo.findById(agendaId);
            if (agendaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Agenda não encontrada"));
            }

            Agenda agenda = agendaOpt.get();

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

            return ResponseEntity.ok(Map.of("mensagem", "Horários adicionados com sucesso!"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Erro ao adicionar horários",
                            "details", e.getMessage()
                    ));
        }
    }
}
