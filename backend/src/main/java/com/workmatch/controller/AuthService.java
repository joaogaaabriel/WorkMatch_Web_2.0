package com.workmatch.controller;

import com.workmatch.dto.LoginDTO;
import com.workmatch.model.Usuario;
import com.workmatch.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository repository;

    public AuthService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Usuario login(LoginDTO dto) throws RuntimeException {

        Usuario usuario;
        usuario = repository.findByLogin(dto.login())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));


        return usuario;
    }
}