package com.workmatch.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Profissional profissional;

    @Column(nullable = false)
    private LocalDate data;

    @JsonFormat(pattern = "HH:mm")
    @Column(nullable = false)
    private String horario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusAgendamento status = StatusAgendamento.CONFIRMADO;

    public enum StatusAgendamento {
        CONFIRMADO, CANCELADO, CONCLUIDO
    }
}