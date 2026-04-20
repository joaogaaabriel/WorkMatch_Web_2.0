package com.workmatch.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workmatch.model.Usuarios;

@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios, UUID> {

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    Optional<Usuarios> findByEmail(String email);
}