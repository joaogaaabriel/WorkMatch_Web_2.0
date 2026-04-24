package com.workmatch.dtq;

public class UsuarioLoginDTO {
    private String email;
    private String senha;

    public UsuarioLoginDTO(String email, String senha) {
        this.email = email;
        this.senha = senha;
    }

    public String getEmail() { return email; }
    public String getSenha() { return senha; }
}
