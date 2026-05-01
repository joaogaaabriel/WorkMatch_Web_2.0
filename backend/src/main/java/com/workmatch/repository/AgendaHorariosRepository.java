package com.workmatch.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.workmatch.model.AgendaHorario;

@Repository
public interface AgendaHorariosRepository extends JpaRepository<AgendaHorario, UUID> {

    List<AgendaHorario> findByAgendaId(UUID agendaId);

    void deleteByAgendaId(UUID agendaId);
}