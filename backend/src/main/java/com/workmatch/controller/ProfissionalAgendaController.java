package com.workmatch.controller;

import java.time.LocalDate;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workmatch.model.Agenda;
import com.workmatch.model.AgendaHorarios;
import com.workmatch.repository.AgendaHorariosRepository;
import com.workmatch.repository.AgendaRepository;

@RestController
@RequestMapping("/api/profissionais")
@CrossOrigin("*")
public class ProfissionalAgendaController {

    @Autowired
    private AgendaRepository agendaRepo;

    @Autowired
    private AgendaHorariosRepository horariosRepo;

    // =========================
    // 🔹 LISTAR AGENDA + HORÁRIOS
    // =========================
    @GetMapping("/{id}/agendas")
    public ResponseEntity<?> listarAgendamentos(
            @PathVariable UUID id,
            @RequestParam String data) {
        try {
            LocalDate dataSelecionada = LocalDate.parse(data);

            Optional<Agenda> agendaOpt = agendaRepo.findByProfissionalIdAndData(id, dataSelecionada);

            if (agendaOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "horarios", List.of(),
                        "ocupados", List.of()
                ));
            }

            Agenda agenda = agendaOpt.get();
            List<String> horarios = horariosRepo.findByAgendaId(agenda.getId())
                    .stream()
                    .map(AgendaHorarios::getHorario)
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "horarios", horarios,
                    "ocupados", List.of()
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
    // 🔹 ADICIONAR HORÁRIOS
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

            // Buscar horários já existentes para a agenda
            List<String> horariosExistentes = horariosRepo.findByAgendaId(agendaId)
                    .stream()
                    .map(AgendaHorarios::getHorario)
                    .toList();

            // Filtrar horários que já existem
            List<String> horariosDuplicados = novosHorarios.stream()
                    .filter(h -> horariosExistentes.contains(h))
                    .toList();

            if (!horariosDuplicados.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of(
                                "error", "Horários já cadastrados para esta agenda",
                                "duplicados", horariosDuplicados
                        ));
            }

            // Salvar apenas horários novos
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
