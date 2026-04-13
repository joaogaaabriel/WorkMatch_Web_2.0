package com.workmatch.dto;

import com.workmatch.validadores.CPFValido;
import com.workmatch.validadores.EmailValido;
import com.workmatch.validadores.TelefoneValido;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioDTO {

    @CPFValido
    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

     @EmailValido
    @NotBlank(message = "E-mail é obrigatório")
    private String email;

    @TelefoneValido
    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;
    
    public CharSequence getSenha() {
        throw new UnsupportedOperationException("Unimplemented method 'getSenha'");
    }
}