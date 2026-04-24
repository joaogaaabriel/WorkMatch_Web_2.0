package com.workmatch.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workmatch.dto.request.AgendamentoRequest;
import com.workmatch.model.Agendamento;
import com.workmatch.service.AgendamentoService;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody AgendamentoRequest request) {
        return ResponseEntity.ok(agendamentoService.criar(request));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Agendamento>> listar(@PathVariable UUID usuarioId) {
        return ResponseEntity.ok(agendamentoService.meusAgendamentos(usuarioId));
    }

    @DeleteMapping("/{id}/usuario/{usuarioId}")
    public ResponseEntity<?> deletar(@PathVariable UUID id,
                                     @PathVariable UUID usuarioId) {

        agendamentoService.deletar(id, usuarioId);
        return ResponseEntity.ok("Agendamento removido");
    }
}