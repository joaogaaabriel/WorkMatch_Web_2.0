package com.workmatch.controller;

import com.workmatch.dto.CandidatureDTO;
import com.workmatch.dto.response.CandidatureResponse;
import com.workmatch.model.Candidature;
import com.workmatch.service.CandidatureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidaturas")
public class CandidaturaController {

    private final CandidatureService service;

    public CandidaturaController(CandidatureService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CandidatureResponse> criar(
            @RequestBody CandidatureDTO dto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.criar(dto));
    }

    @GetMapping("/servico/{servicoId}")
    public ResponseEntity<List<Candidature>> listar(
            @PathVariable UUID servicoId
    ) {
        return ResponseEntity.ok(
                service.listarPorServico(servicoId)
        );
    }
}