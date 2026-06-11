package com.workmatch.repository;

import com.workmatch.model.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CandidatureRepository extends JpaRepository<Candidature, UUID> {

    List<Candidature> findByServicoId(UUID servicoId);

    List<Candidature> findByProfissionalId(UUID profissionalId);

    boolean existsByServicoIdAndProfissionalId(UUID servicoId, UUID profissionalId);
}
