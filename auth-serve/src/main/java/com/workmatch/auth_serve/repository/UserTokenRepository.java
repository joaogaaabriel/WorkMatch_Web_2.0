package com.workmatch.auth_serve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workmatch.auth_serve.model.UserToken;

import java.util.List;
import java.util.UUID;

public interface UserTokenRepository extends JpaRepository<UserToken, UUID> {
    UserToken findByToken(String token);
    List<UserToken> findByUserId(String userId);
    List<UserToken> findByUserIdAndRole(String userId, String role);
}
