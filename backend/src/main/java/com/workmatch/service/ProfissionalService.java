package com.workmatch.service;

import com.workmatch.dto.ProfissionalDTO;
import com.workmatch.keycloak.KeycloakRegistrationService;
import com.workmatch.model.Profissional;
import com.workmatch.repository.ProfissionalRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProfissionalService {

    private final ProfissionalRepository repository;
    private final KeycloakRegistrationService keycloakRegistrationService;

    public ProfissionalService(ProfissionalRepository repository,
                               KeycloakRegistrationService keycloakRegistrationService) {
        this.repository = repository;
        this.keycloakRegistrationService = keycloakRegistrationService;
    }

    @Transactional
    public Profissional cadastrar(ProfissionalDTO dto) {
        validarDuplicatas(dto);

        String keycloakId = keycloakRegistrationService.register(
                dto.login(), dto.email(), dto.nome(), dto.senha(), "PROFISSIONAL"
        );

        try {
            Profissional profissional = toEntity(dto);
            profissional.setKeycloakId(keycloakId);
            return repository.save(profissional);
        } catch (Exception ex) {
            keycloakRegistrationService.rollback(keycloakId);
            throw ex;
        }
    }

    public Profissional buscarPorId(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Profissional não encontrado"));
    }

    public List<Profissional> listar(String especialidade, String cidade) {
        if (especialidade != null && cidade != null) {
            return repository.findByEspecialidadeContainingIgnoreCaseAndCidadeContainingIgnoreCase(especialidade, cidade);
        }
        if (especialidade != null) {
            return repository.findByEspecialidadeContainingIgnoreCase(especialidade);
        }
        if (cidade != null) {
            return repository.findByCidadeContainingIgnoreCase(cidade);
        }
        return repository.findAll();
    }

    @Transactional
    public Profissional actualizer(UUID id, ProfissionalDTO dto) {
        Profissional profissional = buscarPorId(id);
        profissional.setNome(dto.nome());
        profissional.setEmail(dto.email());
        profissional.setTelefone(dto.telefone());
        profissional.setDataNascimento(dto.dataNascimento());
        profissional.setEndereco(dto.endereco());
        profissional.setCidade(dto.cidade());
        profissional.setEstado(dto.estado());
        profissional.setEspecialidade(dto.especialidade());
        profissional.setDescricao(dto.descricao());
        profissional.setExperienciaAnos(dto.experienciaAnos());
        return repository.save(profissional);
    }

    @Transactional
    public void deletable(UUID id) {
        Profissional profissional = buscarPorId(id);
        keycloakRegistrationService.rollback(profissional.getKeycloakId());
        repository.deleteById(id);
    }

    private void validarDuplicatas(ProfissionalDTO dto) {
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

    private Profissional toEntity(ProfissionalDTO dto) {
        Profissional profissional = new Profissional();
        profissional.setNome(dto.nome());
        profissional.setCpf(dto.cpf());
        profissional.setEmail(dto.email());
        profissional.setTelefone(dto.telefone());
        profissional.setDataNascimento(dto.dataNascimento());
        profissional.setEndereco(dto.endereco());
        profissional.setCidade(dto.cidade());
        profissional.setEstado(dto.estado());
        profissional.setEspecialidade(dto.especialidade());
        profissional.setDescricao(dto.descricao());
        profissional.setExperienciaAnos(dto.experienciaAnos());
        profissional.setLogin(dto.login());
        profissional.setSenha(dto.senha());
        return profissional;
    }
}