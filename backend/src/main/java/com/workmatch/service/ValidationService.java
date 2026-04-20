package com.workmatch.service;

import com.workmatch.dto.UsuarioDTO;
import com.workmatch.validadores.Validator;
import com.workmatch.validadores.ValidatorFactory;
import org.springframework.stereotype.Service;

@Service
public class ValidationService {

    public boolean validar(String tipo, UsuarioDTO dto) {
        String valor = resolverValor(tipo, dto);

        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(tipo + " não pode ser vazio");
        }

        Validator<String> validator = ValidatorFactory.get(tipo);
        if (validator == null) {
            throw new UnsupportedOperationException("Tipo de validação inválido: " + tipo);
        }

        if (!validator.isValid(valor)) {
            throw new IllegalArgumentException(validator.getMessage());
        }

        return true;
    }

    private String resolverValor(String tipo, UsuarioDTO dto) {
        return switch (tipo.toLowerCase()) {
            case "cpf"   -> dto.getCpf();
            case "email" -> dto.getEmail();
            default      -> null;
        };
    }
}