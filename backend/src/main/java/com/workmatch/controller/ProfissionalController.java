package com.workmatch.controller;

import com.workmatch.dto.UsuarioDTO;
import com.workmatch.dto.response.ProfissionalResponse;
import com.workmatch.model.Profissional;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {

    private final UsuarioService          usuarioService;
    private final ProfissionalRepository  profissionalRepository;

    public ProfissionalController(UsuarioService usuarioService,
                                   ProfissionalRepository profissionalRepository) {
        this.usuarioService         = usuarioService;
        this.profissionalRepository = profissionalRepository;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody @Valid UsuarioDTO dto) {
        dto.setRole("PROFISSIONAL");
        Profissional p = (Profissional) usuarioService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", "Profissional cadastrado com sucesso",
                "usuario", Map.of("nome", p.getNome())
        ));
    }

    // B07 corrigido — agora busca na tabela profissionais, não em usuarios
    @GetMapping("/{id}")
    public ResponseEntity<ProfissionalResponse> buscarPorId(@PathVariable UUID id) {
        Profissional p = profissionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Profissional não encontrado"));

        return ResponseEntity.ok(new ProfissionalResponse(
                p.getId(),
                p.getNome(),
                p.getEspecialidade(),
                p.getDescricao(),
                p.getExperienciaAnos(),
                p.getAvaliacaoMedia(),
                p.getTotalAvaliacoes(),
                p.getCidade(),
                p.getEstado(),
                p.getAtivo()
        ));
    }
}
