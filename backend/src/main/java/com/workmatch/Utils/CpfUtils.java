package com.workmatch.Utils;

public class CpfUtils {

    public static boolean isValidCPF(String cpf) {
        if (cpf == null) return false;

        cpf = cpf.replaceAll("[^0-9]", "");

        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}"))
            return false;

        try {
            int soma = 0;
            for (int i = 0; i < 9; i++)
                soma += (cpf.charAt(i) - '0') * (10 - i);

            int dig1 = 11 - (soma % 11);
            if (dig1 > 9) dig1 = 0;

            if (dig1 != (cpf.charAt(9) - '0'))
                return false;

            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += (cpf.charAt(i) - '0') * (11 - i);

            int dig2 = 11 - (soma % 11);
            if (dig2 > 9) dig2 = 0;

            return dig2 == (cpf.charAt(10) - '0');

        } catch (Exception e) {
            return false;
        }
    }
}
