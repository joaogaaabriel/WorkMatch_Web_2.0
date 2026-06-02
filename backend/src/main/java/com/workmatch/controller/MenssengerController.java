package com.workmatch.controller;

import com.workmatch.dto.MenssengerDTO;
import com.workmatch.dto.response.MenssengerResponse;
import com.workmatch.service.MenssengerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mensagens")
public class MenssengerController {

    private final MenssengerService service;

    public MenssengerController(MenssengerService service) {
        this.service = service;
    }

    @GetMapping("/servico/{servicoId}")
    public ResponseEntity<List<MenssengerResponse>> listar(
            @PathVariable UUID servicoId) {

        return ResponseEntity.ok(
                service.listarPorServico(servicoId)
        );
    }

    @PostMapping
    public ResponseEntity<MenssengerResponse> enviar(
            @RequestBody @Valid MenssengerDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.enviar(dto));
    }
}