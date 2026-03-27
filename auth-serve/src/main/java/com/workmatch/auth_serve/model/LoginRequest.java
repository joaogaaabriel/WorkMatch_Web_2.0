package com.workmatch.auth_serve.model;

public class LoginRequest {

    private String login;
    private String role;
    private String email;
    private String senha;

    // 🔥 Método unificado para pegar email OU login
    public String getCredencial() {
        if (email != null && !email.isBlank()) {
            return email.trim();
        }
        if (login != null && !login.isBlank()) {
            return login.trim();
        }
        return null;
    }

    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}
