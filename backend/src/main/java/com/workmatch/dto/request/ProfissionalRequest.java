package com.workmatch.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfissionalRequest {

    private String nome;
    private String cpf;
    private String email;
    private String telefone;

    private String descricao;
    private Integer experienciaAnos;

    private String cidade;
    private String estado;
    private String endereco;
}