package com.workmatch.validadores;

public interface Validator<T> {
    boolean isValid(T value);
    String getMessage();
}
