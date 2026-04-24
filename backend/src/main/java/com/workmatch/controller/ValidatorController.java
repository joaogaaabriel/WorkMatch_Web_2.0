package com.workmatch.controller;

import com.workmatch.dtq.UsuarioDTO;
import com.workmatch.service.ValidationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/validar")
@CrossOrigin(origins = "*")
public class ValidatorController {
    public ValidatorController(ValidationService validationService) {
    }

    @PostMapping("/{tipo}")
    public ResponseEntity<?> validarUsuario(@RequestBody @Valid UsuarioDTO dto) {

        return ResponseEntity.ok(Map.of(
            "valido", true
    ));
    }
}