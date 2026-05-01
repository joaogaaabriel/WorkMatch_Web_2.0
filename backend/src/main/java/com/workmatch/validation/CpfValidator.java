package com.workmatch.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfValidator implements ConstraintValidator<CpfValida, String> {

    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        if (cpf == null) return false;

        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) return false;

        try {
            int firstDigit = calculateDigit(cpf, 9, 10);
            if (firstDigit != (cpf.charAt(9) - '0')) return false;

            int secondDigit = calculateDigit(cpf, 10, 11);
            return secondDigit == (cpf.charAt(10) - '0');

        } catch (Exception e) {
            return false;
        }
    }

    private int calculateDigit(String cpf, int length, int weight) {
        int sum = 0;
        for (int i = 0; i < length; i++) {
            sum += (cpf.charAt(i) - '0') * (weight - i);
        }
        int digit = 11 - (sum % 11);
        return digit > 9 ? 0 : digit;
    }
}