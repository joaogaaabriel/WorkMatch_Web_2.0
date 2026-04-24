package com.workmatch.controller;

import com.workmatch.dto.request.AgendaRequest;
import com.workmatch.dto.response.AgendaResponse;
import com.workmatch.model.AgendaHorario;
import com.workmatch.service.AgendaService;
import com.workmatch.repository.AgendaRepository;
import com.workmatch.repository.AgendaHorariosRepository;
import com.workmatch.repository.AgendamentoRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.*;

@RestController
@RequestMapping("/api/agendas")
public class AgendaController {

    private final AgendaService agendaService;
    private final AgendaRepository agendaRepo;
    private final AgendaHorariosRepository horariosRepo;
    private final AgendamentoRepository agendamentoRepo;

    public AgendaController(
            AgendaService agendaService,
            AgendaRepository agendaRepo,
            AgendaHorariosRepository horariosRepo,
            AgendamentoRepository agendamentoRepo) {

        this.agendaService = agendaService;
        this.agendaRepo = agendaRepo;
        this.horariosRepo = horariosRepo;
        this.agendamentoRepo = agendamentoRepo;
    }

    @PostMapping("/{profissionalId}")
    public ResponseEntity<?> criar(@PathVariable UUID profissionalId,
                                   @RequestBody AgendaRequest request) {
        UUID id = agendaService.criar(profissionalId, request);
        return ResponseEntity.status(201)
                .body(Map.of("agendaId", id));
    }

    @PutMapping("/{agendaId}")
    public ResponseEntity<Void> atualizar(@PathVariable UUID agendaId,
                                          @RequestBody AgendaRequest request) {
        agendaService.atualizar(agendaId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{agendaId}")
    public ResponseEntity<Void> deletar(@PathVariable UUID agendaId) {
        agendaService.deletar(agendaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{agendaId}")
    public ResponseEntity<AgendaResponse> buscar(@PathVariable UUID agendaId) {
        return ResponseEntity.ok(agendaService.buscarPorId(agendaId));
    }


    @GetMapping("/profissionais/{id}/horarios")
    public ResponseEntity<?> listarHorarios(
            @PathVariable UUID id,
            @RequestParam String data) {

        LocalDate dataSelecionada;

        try {
            dataSelecionada = LocalDate.parse(data);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Data inválida (YYYY-MM-DD)"));
        }

        var agenda = agendaRepo.findByProfissionalIdAndData(id, dataSelecionada);

        if (agenda.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "horarios", List.of(),
                    "ocupados", List.of()
            ));
        }

        UUID agendaId = agenda.get().getId();

        List<String> horarios = horariosRepo.findByAgendaId(agendaId)
                .stream()
                .map(AgendaHorario::getHorario)
                .toList();

        List<String> ocupados = agendamentoRepo
                .findByProfissionalIdAndData(id, dataSelecionada)
                .stream()
                .map(a -> String.valueOf(a.getHorario()))
                .toList();

        return ResponseEntity.ok(Map.of(
                "horarios", horarios,
                "ocupados", ocupados
        ));
    }

    @PostMapping("/{agendaId}/horarios")
    public ResponseEntity<?> adicionarHorarios(
            @PathVariable UUID agendaId,
            @RequestBody Map<String, List<String>> body) {

        List<String> novos = body.get("horarios");

        if (novos == null || novos.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Lista vazia"));
        }

        var agenda = agendaRepo.findById(agendaId);

        if (agenda.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Agenda não encontrada"));
        }

        List<String> existentes = horariosRepo.findByAgendaId(agendaId)
                .stream()
                .map(AgendaHorario::getHorario)
                .toList();

        List<String> duplicados = novos.stream()
                .filter(existentes::contains)
                .toList();

        if (!duplicados.isEmpty()) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Horários duplicados", "duplicados", duplicados));
        }

        novos.forEach(hr -> {
            AgendaHorario h = new AgendaHorario();
            h.setHorario(hr);
            h.setAgenda(agenda.get());
            horariosRepo.save(h);
        });

        return ResponseEntity.ok(Map.of("mensagem", "Horários adicionados"));
    }
}
