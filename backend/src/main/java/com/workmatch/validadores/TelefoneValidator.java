package com.workmatch.validadores;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TelefoneValidator implements ConstraintValidator<TelefoneValido, String> {

    @Override
    public boolean isValid(String telefone, ConstraintValidatorContext context) {

        if (telefone == null) return false;

        telefone = telefone.replaceAll("\\D", "");

        return telefone.matches("^\\d{2}9\\d{8}$");
    }
}