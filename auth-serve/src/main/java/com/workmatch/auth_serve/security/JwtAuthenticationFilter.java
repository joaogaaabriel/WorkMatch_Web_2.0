package com.workmatch.auth_serve.security;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.workmatch.auth_serve.model.User;
import com.workmatch.auth_serve.model.UserToken;
import com.workmatch.auth_serve.repository.UserRepository;
import com.workmatch.auth_serve.repository.UserTokenRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        // 🔥 Busca no banco (TOKEN OPACO)
        UserToken t = tokenRepository.findByToken(token);

        if (t != null
                && !t.isExpired()
                && t.getExpiresAt().isAfter(LocalDateTime.now())) {

            User user = userRepository.findById(
                    UUID.fromString(t.getUserId())
            ).orElse(null);

            if (user != null) {
                UsernamePasswordAuthenticationToken auth =
            new UsernamePasswordAuthenticationToken(
                user, null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
            );



                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

    String path = request.getServletPath();
    String method = request.getMethod();

    if ("OPTIONS".equalsIgnoreCase(method)) return true;

    // LIBERAR login do admin
    if (path.startsWith("/admin/login")) return true;
    if (path.startsWith("/admin/create-admin")) return true;

    // seu login antigo
    if ("/api/login".equals(path)) return true;

    return false;
}

}
