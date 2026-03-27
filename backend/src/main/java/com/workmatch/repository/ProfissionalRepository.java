package com.workmatch.repository;

import com.workmatch.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProfissionalRepository extends JpaRepository<Profissional, UUID> {
    boolean existsByCpf(String cpf);
    
}
