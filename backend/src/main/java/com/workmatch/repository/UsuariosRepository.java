package com.workmatch.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.workmatch.dto.UsuarioLoginDTO;
import com.workmatch.model.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, UUID> {
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);

    Usuarios findByEmail(String email);
    Optional<Usuarios> findOptionalByEmail(String email);

    @Query("SELECT new com.workmatch.dto.UsuarioLoginDTO(u.email, u.senha) FROM Usuarios u")
    List<UsuarioLoginDTO> listarEmailsSenhas();

}





