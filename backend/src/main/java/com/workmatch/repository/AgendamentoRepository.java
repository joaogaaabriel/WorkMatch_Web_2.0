package com.workmatch.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.workmatch.model.Agendamento;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, UUID> {

    boolean existsByProfissionalIdAndDataAndHorario(UUID profissionalId, LocalDate data, String horario);

    List<Agendamento> findByProfissionalIdAndData(UUID profissionalId, LocalDate data);

    List<Agendamento> findByUsuarioId(UUID usuarioId);

    @Modifying
    @Transactional
    void deleteByProfissionalId(UUID profissionalId);
}