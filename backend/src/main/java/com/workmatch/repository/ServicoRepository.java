package com.workmatch.repository;

import com.workmatch.model.Servico;
import com.workmatch.model.StatusServico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ServicoRepository extends JpaRepository<Servico, UUID> {

    List<Servico> findByClienteId(UUID clienteId);

    List<Servico> findByClienteIdAndStatus(UUID clienteId, StatusServico status);

    List<Servico> findByProfissionalId(UUID profissionalId);

    List<Servico> findByProfissionalIdAndStatus(UUID profissionalId, StatusServico status);

    List<Servico> findByStatus(StatusServico status);

    List<Servico> findByEspecialidadeContainingIgnoreCaseAndStatus(String especialidade, StatusServico status);

    List<Servico> findByCidadeContainingIgnoreCaseAndStatus(String cidade, StatusServico status);
}