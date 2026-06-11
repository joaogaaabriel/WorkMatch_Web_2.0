package com.workmatch.controller;

import com.workmatch.dto.CandidatureDTO;
import com.workmatch.dto.response.CandidatureResponse;
import com.workmatch.service.CandidatureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidaturas")
public class CandidatureController {

    private final CandidatureService service;

    public CandidatureController(CandidatureService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CandidatureResponse> criar(@RequestBody CandidatureDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/servico/{servicoId}")
    public ResponseEntity<List<CandidatureResponse>> listarPorServico(@PathVariable UUID servicoId) {
        return ResponseEntity.ok(service.listarPorServico(servicoId));
    }

    // Endpoint novo — HomeProfissional precisa saber em quais serviços já se candidatou
    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<List<CandidatureResponse>> listarPorProfissional(
            @PathVariable UUID profissionalId) {
        return ResponseEntity.ok(service.listarPorProfissional(profissionalId));
    }
}
