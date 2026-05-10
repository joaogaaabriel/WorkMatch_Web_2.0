package com.workmatch.service;

import com.workmatch.dto.UsuarioDTO;
import com.workmatch.keycloak.KeycloakRegistrationService;
import com.workmatch.model.Usuario;
import com.workmatch.repository.UsuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final KeycloakRegistrationService keycloakRegistrationService;

    public UsuarioService(UsuarioRepository repository,
                          KeycloakRegistrationService keycloakRegistrationService) {
        this.repository = repository;
        this.keycloakRegistrationService = keycloakRegistrationService;
    }

    @Transactional
    public Usuario cadastrar(UsuarioDTO dto) {
        validarDuplicatas(dto);

        String keycloakId = keycloakRegistrationService.register(
                dto.login(), dto.email(), dto.nome(), dto.senha(), "CLIENTE"
        );

        try {
            Usuario usuario = toEntity(dto);
            usuario.setKeycloakId(keycloakId);
            return repository.save(usuario);
        } catch (Exception ex) {
            keycloakRegistrationService.rollback(keycloakId);
            throw ex;
        }
    }

    public Usuario buscarPorId(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    @Transactional
    public Usuario atualizar(UUID id, UsuarioDTO dto) {
        Usuario usuario = buscarPorId(id);
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setTelefone(dto.telefone());
        usuario.setDataNascimento(dto.dataNascimento());
        usuario.setEndereco(dto.endereco());
        usuario.setCidade(dto.cidade());
        usuario.setEstado(dto.estado());
        return repository.save(usuario);
    }

    @Transactional
    public void deletar(UUID id) {
        Usuario usuario = buscarPorId(id);
        keycloakRegistrationService.rollback(usuario.getKeycloakId());
        repository.deleteById(id);
    }

    public boolean existePorCpf(String cpf) {
        return repository.existsByCpf(cpf);
    }

    private void validarDuplicatas(UsuarioDTO dto) {
        if (repository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }
        if (repository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        if (repository.existsByLogin(dto.login())) {
            throw new IllegalArgumentException("Login já está em uso");
        }
    }

    private Usuario toEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setCpf(dto.cpf());
        usuario.setEmail(dto.email());
        usuario.setTelefone(dto.telefone());
        usuario.setDataNascimento(dto.dataNascimento());
        usuario.setEndereco(dto.endereco());
        usuario.setCidade(dto.cidade());
        usuario.setEstado(dto.estado());
        usuario.setLogin(dto.login());
        usuario.setSenha(dto.senha());
        return usuario;
    }
}