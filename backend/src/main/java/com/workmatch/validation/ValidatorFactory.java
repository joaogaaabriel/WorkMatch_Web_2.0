    package com.workmatch.validation;

    import java.util.HashMap;
    import java.util.Map;

    public class ValidatorFactory {

        private static final Map<String, Validator<String>> validators = new HashMap<>();

     
        public static Validator<String> getValidator(String tipo) {
            return validators.get(tipo);
        }

        public static Validator<String> get(String tipo) {
            throw new UnsupportedOperationException("Unimplemented method 'get'");
        }
    }