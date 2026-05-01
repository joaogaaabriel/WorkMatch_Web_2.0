package com.workmatch.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmatch.dto.request.AgendamentoRequest;
import com.workmatch.dto.response.AgendamentoResponse;
import com.workmatch.model.Agendamento;
import com.workmatch.model.Profissional;
import com.workmatch.model.Usuario;
import com.workmatch.repository.AgendamentoRepository;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.repository.UsuarioRepository;
import com.workmatch.service.AgendamentoService;

@Service
public class AgendamentoServiceImpl implements AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ProfissionalRepository profissionalRepository;
    private final UsuarioRepository usuarioRepository;

    public AgendamentoServiceImpl(
            AgendamentoRepository agendamentoRepository,
            ProfissionalRepository profissionalRepository,
            UsuarioRepository usuarioRepository) {

        this.agendamentoRepository = agendamentoRepository;
        this.profissionalRepository = profissionalRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public AgendamentoResponse criar(AgendamentoRequest request) {


        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Profissional profissional = profissionalRepository.findById(request.getProfissionalId())
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        String horario = request.getHorario();



        Agendamento agendamento = new Agendamento();
        agendamento.setUsuario(usuario);
        agendamento.setProfissional(profissional);
        agendamento.setData(request.getData());
        agendamento.setHorario(horario);

        Agendamento salvo = agendamentoRepository.save(agendamento);

        return new AgendamentoResponse(
                salvo.getId(),
                usuario.getId(),
                profissional.getId(),
                salvo.getData(),
                salvo.getHorario()
        );
    }

    @Override
    public List<Agendamento> meusAgendamentos(UUID usuarioId) {
        return agendamentoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public void deletar(UUID id, UUID usuarioId) {



        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));



        agendamentoRepository.delete(agendamento);
    }
}