package com.workmatch.repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.workmatch.model.Agenda;

@Repository
public interface AgendaRepository extends JpaRepository<Agenda, UUID> {

    Optional<Agenda> findByProfissionalIdAndData(UUID profissionalId, LocalDate data);

    boolean existsByProfissionalIdAndData(UUID profissionalId, LocalDate data);


}
