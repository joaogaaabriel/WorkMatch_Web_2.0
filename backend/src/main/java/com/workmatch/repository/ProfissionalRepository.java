package com.workmatch.repository;

import com.workmatch.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfissionalRepository extends JpaRepository<Profissional, UUID> {

    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
    boolean existsByLogin(String login);

    List<Profissional> findByEspecialidadeContainingIgnoreCase(String especialidade);
    List<Profissional> findByCidadeContainingIgnoreCase(String cidade);
    List<Profissional> findByEspecialidadeContainingIgnoreCaseAndCidadeContainingIgnoreCase(String especialidade, String cidade);

    Optional<Profissional> findByLogin(String login);
}
