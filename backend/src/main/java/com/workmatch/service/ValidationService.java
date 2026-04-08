package com.workmatch.service;

import com.workmatch.validadores.Validator;
import com.workmatch.validadores.ValidatorFactory;
import org.springframework.stereotype.Service;

@Service
public class ValidationService {

    public boolean validar(String tipo, String valor) {

        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(tipo + " não pode ser vazio.");
        }

        Validator<String> validator = ValidatorFactory.get(tipo);

        if (validator == null) {
            throw new IllegalArgumentException("Tipo de validação inválido: " + tipo);
        }

        if (!validator.isValid(valor)) {
            throw new IllegalArgumentException(validator.getMessage());
        }

        return true;
    }
}