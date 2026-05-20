package com.workmatch.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfissionalResponse {

    private UUID id;

    private String nome;
    private String email;
    private String telefone;

    private String descricao;
    private Integer experienciaAnos;

    private String cidade;
    private String estado;
    private String endereco;
}