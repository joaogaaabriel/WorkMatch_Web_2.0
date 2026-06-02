package com.workmatch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
    @Setter
    @Entity
    @Table(name = "mensagens")
    public class Menssenger {

        @Id
        @GeneratedValue
        private UUID id;

        @ManyToOne
        @JoinColumn(name = "servico_id")
        private Servico servico;

        @ManyToOne
        @JoinColumn(name = "remetente_id")
        private Profissional remetente;

        @ManyToOne
        @JoinColumn(name = "destinatario_id")
        private Usuario destinatario;

        @Column(nullable = false, length = 1000)
        private String conteudo;

        private LocalDateTime enviadoEm = LocalDateTime.now();

    }
