package com.workmatch.controller;

import com.workmatch.model.Profissional;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.repository.AgendaRepository;
import com.workmatch.repository.AgendamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profissionais")
@CrossOrigin("*")
public class ProfissionalController {

    private final ProfissionalRepository profissionalRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public ProfissionalController(ProfissionalRepository profissionalRepository,
                                  AgendaRepository agendaRepository) {
        this.profissionalRepository = profissionalRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Profissional> profissionais = profissionalRepository.findAll();
            return ResponseEntity.ok(profissionais);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro interno ao listar profissionais", "details", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        try {
            Optional<Profissional> profissional = profissionalRepository.findById(id);
            if (profissional.isPresent()) {
                return ResponseEntity.ok(profissional.get());
            } else {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "Profissional não encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro interno ao buscar profissional", "details", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Profissional profissional) {
        try {
            if (profissional == null || profissional.getCpf() == null || profissional.getNome() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "CPF e nome são obrigatórios"));
            }

            if (profissionalRepository.existsByCpf(profissional.getCpf())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "CPF já cadastrado"));
            }

            Profissional salvo = profissionalRepository.save(profissional);
            return ResponseEntity.ok("Profissional salvo com sucesso");

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro interno ao criar profissional", "details", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable UUID id,
                                       @RequestBody Profissional profissionalAtualizado) {
        try {
            if (profissionalAtualizado == null || profissionalAtualizado.getNome() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Nome é obrigatório"));
            }

            Optional<Profissional> profissionalOpt = profissionalRepository.findById(id);
            if (profissionalOpt.isPresent()) {
                Profissional profissional = profissionalOpt.get();
                profissional.setNome(profissionalAtualizado.getNome());
                profissional.setEmail(profissionalAtualizado.getEmail());
                profissional.setTelefone(profissionalAtualizado.getTelefone());
                profissional.setDescricao(profissionalAtualizado.getDescricao());
                profissional.setExperienciaAnos(profissionalAtualizado.getExperienciaAnos());
                profissional.setCidade(profissionalAtualizado.getCidade());
                profissional.setEstado(profissionalAtualizado.getEstado());
                profissional.setEndereco(profissionalAtualizado.getEndereco());
                Profissional atualizado = profissionalRepository.save(profissional);
                return ResponseEntity.ok(atualizado);
            } else {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "Profissional não encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro interno ao atualizar profissional", "details", e.getMessage()));
        }
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable UUID id) {
        try {
            Optional<Profissional> profissionalOpt = profissionalRepository.findById(id);
            if (profissionalOpt.isEmpty()) {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "Profissional não encontrado"));
            }

            Profissional profissional = profissionalOpt.get();

            // 1️⃣ EXCLUIR AGENDAMENTOS DO PROFISSIONAL
            agendamentoRepository.deleteByProfissionalId(profissional.getId());


            // 2️⃣ AGENDAS E HORÁRIOS SERÃO DELETADOS AUTOMATICAMENTE (Cascade + orphanRemoval)
            profissionalRepository.delete(profissional);

            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro interno ao deletar profissional", "details", e.getMessage()));
        }
    }

}
