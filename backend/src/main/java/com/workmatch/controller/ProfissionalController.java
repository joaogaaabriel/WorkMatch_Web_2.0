package com.workmatch.controller;

import com.workmatch.dto.request.ProfissionalRequest;
import com.workmatch.dto.response.ProfissionalResponse;
import com.workmatch.model.Profissional;
import com.workmatch.repository.AgendamentoRepository;
import com.workmatch.repository.ProfissionalRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {

    private final ProfissionalRepository profissionalRepository;
    private final AgendamentoRepository agendamentoRepository;

    public ProfissionalController(
            ProfissionalRepository profissionalRepository,
            AgendamentoRepository agendamentoRepository) {
        this.profissionalRepository = profissionalRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Profissional> profissionais = profissionalRepository.findAll();
        return ResponseEntity.ok(profissionais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        Profissional profissional = profissionalRepository.findById(id).orElse(null);
        if (profissional == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of());
        }
        return ResponseEntity.ok(profissional);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody ProfissionalRequest request) {

        if (request.getCpf() == null || request.getNome() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of());
        }

        if (profissionalRepository.existsByCpf(request.getCpf())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of());
        }

        Profissional profissional = new Profissional();

        profissional.setNome(request.getNome());
        profissional.setCpf(request.getCpf());
        profissional.setEmail(request.getEmail());
        profissional.setTelefone(request.getTelefone());
        profissional.setDescricao(request.getDescricao());
        profissional.setExperienciaAnos(request.getExperienciaAnos());
        profissional.setCidade(request.getCidade());
        profissional.setEstado(request.getEstado());
        profissional.setEndereco(request.getEndereco());

        Profissional salvo = profissionalRepository.save(profissional);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ProfissionalResponse(
                        salvo.getId(),
                        salvo.getNome(),
                        salvo.getEmail(),
                        salvo.getTelefone(),
                        salvo.getDescricao(),
                        salvo.getExperienciaAnos(),
                        salvo.getCidade(),
                        salvo.getEstado(),
                        salvo.getEndereco()
                ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable UUID id,
            @RequestBody Profissional profissionalActualization) {

        if (profissionalActualization == null || profissionalActualization.getNome() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of());
        }

        Profissional profissional = profissionalRepository.findById(id).orElse(null);
        if (profissional == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of());
        }

        profissional.setNome(profissionalActualization.getNome());
        profissional.setTelefone(profissionalActualization.getTelefone());
        profissional.setDescricao(profissionalActualization.getDescricao());
        profissional.setExperienciaAnos(profissionalActualization.getExperienciaAnos());
        profissional.setCidade(profissionalActualization.getCidade());
        profissional.setEstado(profissionalActualization.getEstado());
        profissional.setEndereco(profissionalActualization.getEndereco());

        return ResponseEntity.ok(profissionalRepository.save(profissional));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletar(@PathVariable UUID id) {
        Profissional profissional = profissionalRepository.findById(id).orElse(null);
        if (profissional == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Profissional não encontrado"));
        }

        agendamentoRepository.deleteByProfissionalId(profissional.getId());
        profissionalRepository.delete(profissional);

        return ResponseEntity.noContent().build();
    }
}