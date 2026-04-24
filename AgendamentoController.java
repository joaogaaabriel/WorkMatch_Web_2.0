package com.workmatch.controller;

import org.springframework.web.bind.annotation.*;

import com.workmatch.model.Agendamento;
import com.workmatch.service.AgendamentoService;

import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin("*")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Agendamento agendamento) {
        return ResponseEntity.status(201).body(service.criar(agendamento));
    }

    @GetMapping("/meus/{usuarioId}")
    public ResponseEntity<?> meus(@PathVariable UUID usuarioId) {
        return ResponseEntity.ok(service.meusAgendamentos(usuarioId));
    }

    @DeleteMapping("/{id}/{usuarioId}")
    public ResponseEntity<?> deletar(@PathVariable UUID id,
                                     @PathVariable UUID usuarioId) {
        service.deletar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}