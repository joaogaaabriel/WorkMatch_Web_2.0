package com.workmatch.config;

import com.workmatch.service.CustomUserDetailsService;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * BUG 017 CORRIGIDO
 *
 * ANTES: anyRequest().permitAll() — todos os endpoints eram públicos,
 * qualquer pessoa sem token podia acessar dados de usuários, profissionais,
 * agendamentos, etc.
 *
 * SOLUÇÃO: Proteção por camadas:
 * - Rotas públicas explícitas (cadastro, validação, listagem de profissionais)
 * - Rotas autenticadas via token Bearer validado no auth-serve
 * - CORS restrito às origens conhecidas (frontend web)
 *
 * NOTA: A autenticação real é feita via auth-serve (token opaco UUID).
 * O backend valida o token chamando /auth/introspect no auth-serve.
 * O Spring Security aqui funciona como camada extra de proteção de rota.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    // Origens permitidas — configure via variável de ambiente
    // Ex: ALLOWED_ORIGINS=https://workmatch.vercel.app,https://workmatch-pi.onrender.com
    @Value("${ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}")
    private String allowedOriginsRaw;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth

                // ── Rotas totalmente públicas ──────────────────────────────
                // OPTIONS sempre liberado (preflight CORS)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Cadastro de usuário
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()

                // Validações de CPF e e-mail no cadastro
                .requestMatchers("/api/validar/**").permitAll()

                // Login (redirecionamento — o real é no auth-serve)
                .requestMatchers(HttpMethod.POST, "/api/login").permitAll()

                // Listagem pública de profissionais (vitrine)
                .requestMatchers(HttpMethod.GET, "/api/profissionais").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/profissionais/{id}").permitAll()

                // Horários disponíveis (necessário para tela de agendamento)
                .requestMatchers(HttpMethod.GET, "/api/profissionais/{id}/agendas").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/agendas/profissionais/**").permitAll()

                // Arquivos estáticos do frontend (quando servido pelo Spring Boot)
                .requestMatchers("/", "/index.html", "/static/**", "/assets/**",
                                 "/*.js", "/*.css", "/*.ico", "/*.png").permitAll()

                // ── Rotas protegidas — requerem token Bearer válido ────────
                // Agendamentos
                .requestMatchers("/api/agendamentos/**").authenticated()

                // CRUD de profissionais (somente ADMIN usa, via auth-serve)
                .requestMatchers(HttpMethod.POST,   "/api/profissionais").authenticated()
                .requestMatchers(HttpMethod.PUT,    "/api/profissionais/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/profissionais/**").authenticated()

                // Agendas (ADMIN)
                .requestMatchers(HttpMethod.POST,   "/api/agendas/**").authenticated()
                .requestMatchers(HttpMethod.PUT,    "/api/agendas/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/agendas/**").authenticated()

                // Usuários — leitura e atualização de perfil
                .requestMatchers("/api/usuarios/**").authenticated()

                // Qualquer outra rota não mapeada acima → bloqueada
                .anyRequest().denyAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // BUG 017 FIX: origens restritas — não mais "*"
        // Em desenvolvimento aceita localhost; em produção define via env
        List<String> origins = List.of(allowedOriginsRaw.split(","));
        config.setAllowedOrigins(origins);

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));

        // false porque usamos "*" no origins — se mudar para domínio específico,
        // pode setar true para cookies/credenciais
        config.setAllowCredentials(false);

        config.setMaxAge(3600L); // cache preflight por 1 hora

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
