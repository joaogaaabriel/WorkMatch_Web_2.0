package com.workmatch.validadores;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = EmailValidador.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface EmailValido {

    String message() default "E-mail inválido";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}