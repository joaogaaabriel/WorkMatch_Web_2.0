package com.workmatch.validation;

public interface Validator<T> {
    boolean isValid(T value);
    String getMessage();
}
