package com.workmatch.service;

import com.workmatch.dto.ProfissionalDTO;
import com.workmatch.model.Profissional;
import com.workmatch.repository.ProfissionalRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProfissionalService {

    private final ProfissionalRepository repository;

    public ProfissionalService(ProfissionalRepository repository) {
        this.repository = repository;
    }

    public Profissional cadastrar(ProfissionalDTO dto) {
        if (repository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }
        if (repository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        if (repository.existsByLogin(dto.login())) {
            throw new IllegalArgumentException("Login já está em uso");
        }

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

        return repository.save(profissional);
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

    public void deletable(UUID id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Profissional não encontrado");
        }
        repository.deleteById(id);
    }

}