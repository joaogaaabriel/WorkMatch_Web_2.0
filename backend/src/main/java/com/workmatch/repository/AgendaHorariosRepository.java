package com.workmatch.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.workmatch.model.AgendaHorarios;

@Repository
public interface AgendaHorariosRepository extends JpaRepository<AgendaHorarios, UUID> {

    List<AgendaHorarios> findByAgendaId(UUID agendaId);

    void deleteByAgendaId(UUID agendaId);

    void deleteByAgendaIdAndHorario(UUID agendaId, String horario);
}