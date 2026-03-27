package com.workmatch.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AgendamentoException.class)
    public ResponseEntity<String> handleAgendamento(AgendamentoException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)  // 409 - conflito de horário
                .body(ex.getMessage());
    }
}
