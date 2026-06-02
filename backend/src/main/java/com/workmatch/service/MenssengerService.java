package com.workmatch.service;

import com.workmatch.dto.MenssengerDTO;
import com.workmatch.dto.response.MenssengerResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MenssengerService {

    public MenssengerResponse enviar(MenssengerDTO ignoredDto) {
        throw new UnsupportedOperationException("Implementar");
    }

    public List<MenssengerResponse> listarPorServico(UUID ignoredServicoId) {
        throw new UnsupportedOperationException("Implementar");
    }
}