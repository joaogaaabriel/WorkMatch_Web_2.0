package com.workmatch.auth_serve.repository;

import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.workmatch.auth_serve.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByLogin(String login);

    Optional<User> findByEmail(String email);
    Optional<User> findByLogin(String login);

    boolean existsByRole(String string);

    boolean existsByCpf(String cpf);

    boolean existsByEmail(String email);

}
