package com.workmatch.service;

import com.workmatch.dto.UsuarioDTO;
import com.workmatch.model.Usuarios;
import com.workmatch.repository.UsuariosRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuariosRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuariosRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuarios cadastrar(UsuarioDTO dto) {

        if (repository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        Usuarios usuario = new Usuarios();
        usuario.setCpf(dto.getCpf());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));

        return repository.save(usuario);
    }
}