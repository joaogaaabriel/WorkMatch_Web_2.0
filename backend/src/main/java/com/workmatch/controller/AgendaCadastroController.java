package com.workmatch.controller;

import com.workmatch.dto.AgendaRequest;
import com.workmatch.service.AgendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/agendas")
public class AgendaController {

    private final AgendaService agendaService;

    public AgendaController(AgendaService agendaService) {
        this.agendaService = agendaService;
    }

    @PostMapping("/{profissionalId}")
    public ResponseEntity<?> criar(@PathVariable UUID profissionalId,
                                   @RequestBody AgendaRequest request) {
        return ResponseEntity.ok(agendaService.criar(profissionalId, request));
    }

    @PutMapping("/{agendaId}")
    public ResponseEntity<?> atualizar(@PathVariable UUID agendaId,
                                       @RequestBody AgendaRequest request) {
        return ResponseEntity.ok(agendaService.atualizar(agendaId, request));
    }

    @DeleteMapping("/{agendaId}")
    public ResponseEntity<?> deletar(@PathVariable UUID agendaId) {
        return ResponseEntity.ok(agendaService.deletar(agendaId));
    }

    @GetMapping("/{agendaId}")
    public ResponseEntity<?> buscar(@PathVariable UUID agendaId) {
        return ResponseEntity.ok(agendaService.buscarPorId(agendaId));
    }
}