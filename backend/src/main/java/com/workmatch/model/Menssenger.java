package com.workmatch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/*
 * Menssenger — entidade de mensagens do chat.
 *
 * O typo no nome da classe é intencional para compatibilidade com o restante
 * da codebase (será corrigido em massa junto ao D10 no futuro).
 *
 * Campos adicionados para B06 (chat bidirecional):
 *   - remetenteUsuario: preenchido quando o remetente é um CLIENTE
 *   - remetenteTipo: "PROFISSIONAL" (padrão) ou "CLIENTE"
 *
 * Com ddl-auto=update as duas novas colunas são criadas automaticamente
 * no próximo boot. Linhas antigas ficam com remetente_tipo=null, tratadas
 * como "PROFISSIONAL" no serviço.
 */
@Getter
@Setter
@Entity
@Table(name = "mensagens")
public class Menssenger {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    // Remetente profissional — preenchido quando remetenteTipo = "PROFISSIONAL"
    @ManyToOne
    @JoinColumn(name = "remetente_id")
    private Profissional remetente;

    // Remetente cliente — preenchido quando remetenteTipo = "CLIENTE"
    @ManyToOne
    @JoinColumn(name = "remetente_usuario_id")
    private Usuario remetenteUsuario;

    // "PROFISSIONAL" ou "CLIENTE" — null em linhas antigas = PROFISSIONAL
    @Column(name = "remetente_tipo", length = 20)
    private String remetenteTipo;

    // Destinatário cliente — preenchido em mensagens PROFISSIONAL→CLIENTE
    @ManyToOne
    @JoinColumn(name = "destinatario_id")
    private Usuario destinatario;

    @Column(nullable = false, length = 1000)
    private String conteudo;

    private LocalDateTime enviadoEm = LocalDateTime.now();
}
