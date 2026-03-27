package com.workmatch.auth_serve.repository;

import java.util.UUID;
import java.util.Optional; // <-- AGORA É O CERTO!
import org.springframework.data.jpa.repository.JpaRepository;

import com.workmatch.auth_serve.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    User findByEmailAndRole(String email, String role);

    User findByLoginAndRole(String login, String role);

    boolean existsByLogin(String login);

    Optional<User> findByEmail(String email);
    Optional<User> findByLogin(String login);

}
