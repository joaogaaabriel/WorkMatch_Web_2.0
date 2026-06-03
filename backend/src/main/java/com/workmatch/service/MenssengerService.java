package com.workmatch.service;

import com.workmatch.dto.MenssengerDTO;
import com.workmatch.dto.response.MenssengerResponse;

import java.util.List;
import java.util.UUID;

public abstract class MenssengerService {

    public abstract MenssengerResponse enviar(
            MenssengerDTO dto
    );

    public abstract List<MenssengerResponse> listarPorServico(
            UUID servicoId
    );
}