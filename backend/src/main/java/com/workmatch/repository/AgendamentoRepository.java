package com.workmatch.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.workmatch.model.Agendamentos;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamentos, UUID> {

    boolean existsByProfissionalIdAndDataAndHorario(UUID profissionalId, LocalDate data, LocalTime horario);

    List<Agendamentos> findByProfissionalIdAndData(UUID profissionalId, LocalDate data);

    List<Agendamentos> findByUsuarioId(UUID usuarioId);

    @Modifying
    @Transactional
    void deleteByProfissionalId(UUID profissionalId);
}