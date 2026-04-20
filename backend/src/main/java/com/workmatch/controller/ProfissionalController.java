package com.workmatch.controller;

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
                    .body(Map.of("error", "Profissional não encontrado"));
        }
        return ResponseEntity.ok(profissional);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Profissional profissional) {
        if (profissional == null || profissional.getCpf() == null || profissional.getNome() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "CPF e nome são obrigatórios"));
        }

        if (profissionalRepository.existsByCpf(profissional.getCpf())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "CPF já cadastrado"));
        }

        Profissional salvo = profissionalRepository.save(profissional);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable UUID id,
            @RequestBody Profissional profissionalAtualizado) {

        if (profissionalAtualizado == null || profissionalAtualizado.getNome() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Nome é obrigatório"));
        }

        Profissional profissional = profissionalRepository.findById(id).orElse(null);
        if (profissional == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Profissional não encontrado"));
        }

        profissional.setNome(profissionalAtualizado.getNome());
        profissional.setEmail(profissionalAtualizado.getEmail());
        profissional.setTelefone(profissionalAtualizado.getTelefone());
        profissional.setDescricao(profissionalAtualizado.getDescricao());
        profissional.setExperienciaAnos(profissionalAtualizado.getExperienciaAnos());
        profissional.setCidade(profissionalAtualizado.getCidade());
        profissional.setEstado(profissionalAtualizado.getEstado());
        profissional.setEndereco(profissionalAtualizado.getEndereco());

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