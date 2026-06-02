package com.workmatch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@Table(name = "candidaturas")
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "servico_id")
    private Servico servico;

    @Setter
    @ManyToOne
    @JoinColumn(name = "profissional_id")
    private Profissional profissional;

    private final LocalDateTime criadoEm = LocalDateTime.now();

}