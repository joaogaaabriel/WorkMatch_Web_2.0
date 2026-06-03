package com.workmatch.controller;

import com.workmatch.dto.ServicoDTO;
import com.workmatch.dto.response.CandidatureResponse;
import com.workmatch.dto.response.ServicoResponse;
import com.workmatch.model.StatusServico;
import com.workmatch.service.ServicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    private final ServicoService service;

    public ServicoController(ServicoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ServicoResponse> criar(
            @RequestBody @Valid ServicoDTO dto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.criar(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicoResponse> buscarPorId(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                service.buscarPorId(id)
        );
    }

    @GetMapping("/publicados")
    public ResponseEntity<List<ServicoResponse>> listarPublicados(
            @RequestParam(required = false) String especialidade,
            @RequestParam(required = false) String cidade
    ) {
        return ResponseEntity.ok(
                service.listarPublicados(especialidade, cidade)
        );
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<ServicoResponse>> listarPorCliente(
            @PathVariable UUID clienteId,
            @RequestParam(required = false) StatusServico status
    ) {
        return ResponseEntity.ok(
                service.listarPorCliente(clienteId, status)
        );
    }

    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<List<ServicoResponse>> listarPorProfissional(
            @PathVariable UUID profissionalId,
            @RequestParam(required = false) StatusServico status
    ) {
        return ResponseEntity.ok(
                service.listarPorProfissional(profissionalId, status)
        );
    }

    @PatchMapping("/{id}/avancar")
    public ResponseEntity<ServicoResponse> avancarStatus(
            @PathVariable UUID id,
            @RequestParam(required = false) UUID profissionalId
    ) {
        return ResponseEntity.ok(
                service.avancarStatus(id, profissionalId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(
            @PathVariable UUID id
    ) {
        service.cancelar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/servico/{servicoId}")
    public ResponseEntity<List<CandidatureResponse>> listar(
            @PathVariable UUID servicoId
    ) {
        return ResponseEntity.ok(
                service.listarPorServico(servicoId)
        );
    }
}