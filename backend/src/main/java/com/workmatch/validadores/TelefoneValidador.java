package com.workmatch.validadores;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Set;

public class TelefoneValidador implements ConstraintValidator<TelefoneValido, String> {

    // DDDs válidos no Brasil
    private static final Set<String> DDD_VALIDOS = Set.of(
            "11","12","13","14","15","16","17","18","19",
            "21","22","24","27","28",
            "31","32","33","34","35","37","38",
            "41","42","43","44","45","46",
            "47","48","49",
            "51","53","54","55",
            "61","62","64",
            "63",
            "65","66",
            "67",
            "68",
            "69",
            "71","73","74","75","77",
            "79",
            "81","87",
            "82",
            "83",
            "84",
            "85","88",
            "86","89",
            "91","93","94",
            "92","97",
            "95",
            "96",
            "98","99"
    );

    @Override
    public boolean isValid(String telefone, ConstraintValidatorContext context) {

        if (telefone == null) return false;

        telefone = telefone.replaceAll("\\D", "");

        if (!telefone.matches("\\d{10,11}")) return false;

        String ddd = telefone.substring(0, 2);

        return DDD_VALIDOS.contains(ddd);
    }
}