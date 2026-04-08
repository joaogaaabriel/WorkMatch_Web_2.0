package com.workmatch.controller;

import com.workmatch.dto.UsuarioDTO;
import com.workmatch.model.Usuarios;
import com.workmatch.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody @Valid UsuarioDTO dto) {

        Usuarios usuario = service.cadastrar(dto);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "id", usuario.getId()
        ));
    }
}