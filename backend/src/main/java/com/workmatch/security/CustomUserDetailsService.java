package com.workmatch.security;

import com.workmatch.model.Usuario;
import com.workmatch.repository.UsuarioRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository repository;

    public CustomUserDetailsService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario cliente = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email não encontrado: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(cliente.getEmail())
                .password(cliente.getSenha())
                .authorities("USER")
                .build();
    }
}