package com.workmatch.repository;

import com.workmatch.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, UUID> {

    boolean existsByServicoIdAndClienteId(UUID servicoId, UUID clienteId);

    Optional<Avaliacao> findByServicoIdAndClienteId(UUID servicoId, UUID clienteId);

    List<Avaliacao> findByProfissionalId(UUID profissionalId);

    List<Avaliacao> findByClienteId(UUID clienteId);

    @Query("SELECT COALESCE(AVG(a.nota), 0) FROM Avaliacao a WHERE a.profissional.id = :profissionalId")
    double calcularMediaPorProfissional(@Param("profissionalId") UUID profissionalId);

    long countByProfissionalId(UUID profissionalId);
}
