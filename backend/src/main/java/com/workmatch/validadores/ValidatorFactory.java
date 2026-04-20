    package com.workmatch.validadores;

    import java.util.HashMap;
    import java.util.Map;

    public class ValidatorFactory {

        private static final Map<String, Validator<String>> validators = new HashMap<>();

        static {
            validators.put("cpf", (Validator<String>) new CpfValidator());
            validators.put("email", (Validator<String>) new EmailValidator());
        }

        public static Validator<String> getValidator(String tipo) {
            return validators.get(tipo);
        }

        public static Validator<String> get(String tipo) {
            throw new UnsupportedOperationException("Unimplemented method 'get'");
        }
    }