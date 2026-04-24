package com.workmatch.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Set;
import java.util.regex.Pattern;

public class EmailValidator implements ConstraintValidator<EmailValida, String> {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private static final Set<String> DOMINIOS_BLOQUEADOS = Set.of(
            "10minutemail.com",
            "tempmail.com",
            "mailinator.com",
            "guerrillamail.com"
    );

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {

        if (email == null) return false;

        email = email.trim().toLowerCase();

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return false;
        }

        String dominio = email.substring(email.indexOf("@") + 1);

        return !DOMINIOS_BLOQUEADOS.contains(dominio);
    }
}