package com.workmatch.dtq;

import java.time.LocalDate;

import com.workmatch.validation.CpfValida;
import com.workmatch.validation.EmailValida;
import com.workmatch.validation.TelefoneValida;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    @CpfValida
    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotNull(message = "Data de nascimento é obrigatória")
    private LocalDate dataNascimento;

    @TelefoneValida
    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    @NotBlank(message = "Endereço é obrigatório")
    @Size(max = 150, message = "Endereço deve ter no máximo 150 caracteres")
    private String endereco;

    @EmailValida
    @NotBlank(message = "E-mail é obrigatório")
    private String email;

    @NotBlank(message = "Login é obrigatório")
    @Size(max = 100, message = "Login deve ter no máximo 100 caracteres")
    private String login;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "Role é obrigatório")
    @Size(max = 20, message = "Role deve ter no máximo 20 caracteres")
    private String role;
}