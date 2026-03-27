package com.workmatch.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class AgendaHorarios {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "agenda_id")
    private Agenda agenda;

    private String horario;

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Agenda getAgenda() { return agenda; }
    public void setAgenda(Agenda agenda) { this.agenda = agenda; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
}
