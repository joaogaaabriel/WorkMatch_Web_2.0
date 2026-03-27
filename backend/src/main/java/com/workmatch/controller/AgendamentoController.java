package com.workmatch.controller;

import java.util.Map;
import java.util.UUID;

import com.workmatch.model.Agendamentos;
import com.workmatch.model.Profissional;
import com.workmatch.model.Usuarios;
import com.workmatch.repository.AgendamentoRepository;
import com.workmatch.repository.ProfissionalRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin("*")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @PostMapping
    public ResponseEntity<?> criarAgendamento(
            @RequestBody Agendamentos agendamento,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            // ======== VALIDAR TOKEN ========
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Token ausente ou inválido"));
            }

            String token = authorizationHeader.replace("Bearer ", "");
            RestTemplate rest = new RestTemplate();
            String url = "http://auth-serve:8082/auth/introspect";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("token", token);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
            Map<String, Object> userInfo = rest.postForObject(url, request, Map.class);

            if (userInfo == null || !"true".equals(userInfo.get("active").toString())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Token inválido ou expirado"));
            }

            // ======== SET USUARIO ========
            String usuarioId = (String) userInfo.get("userId");
            Usuarios usuario = new Usuarios();
            usuario.setId(UUID.fromString(usuarioId));
            agendamento.setUsuario(usuario);

            // ======== VALIDAR E CARREGAR PROFISSIONAL ========
            UUID profissionalId = agendamento.getProfissional().getId();
            Profissional profissional = profissionalRepository.findById(profissionalId).orElse(null);
            if (profissional == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Profissional não encontrado"));
            }
            agendamento.setProfissional(profissional);

            // ======== VERIFICAR HORÁRIO DUPLICADO ========
            boolean existe = agendamentoRepository.existsByProfissionalIdAndDataAndHorario(
                    profissionalId,
                    agendamento.getData(),
                    agendamento.getHorario()
            );
            if (existe) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Este horário já está ocupado para este profissional"));
            }

            // ======== SALVAR AGENDAMENTO ========
            agendamentoRepository.save(agendamento);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensagem", "Agendamento confirmado com sucesso"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao criar agendamento", "details", e.getMessage()));
        }
    }

        @GetMapping("/meus")
        public ResponseEntity<?> listarMeusAgendamentos(
                @RequestHeader("Authorization") String authorizationHeader
        ) {
            try {
                // ======== VALIDAR TOKEN ========
                if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Token ausente ou inválido"));
                }

                String token = authorizationHeader.replace("Bearer ", "");
                RestTemplate rest = new RestTemplate();
                String url = "http://auth-serve:8082/auth/introspect";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
                form.add("token", token);

                HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
                Map<String, Object> userInfo = rest.postForObject(url, request, Map.class);

                if (userInfo == null || !"true".equals(userInfo.get("active").toString())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Token inválido ou expirado"));
                }

                // ======== PEGAR USUÁRIO DO TOKEN ========
                String usuarioId = (String) userInfo.get("userId");
                UUID uuid = UUID.fromString(usuarioId);

                // ======== BUSCAR AGENDAMENTOS ========
                return ResponseEntity.ok(agendamentoRepository.findByUsuarioId(uuid));

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Erro ao buscar agendamentos", "details", e.getMessage()));
            }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deletarAgendamento(
                @PathVariable UUID id,
                @RequestHeader("Authorization") String authorizationHeader
        ) {
            try {
                // ======== VALIDAR TOKEN ========
                if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Token ausente ou inválido"));
                }

                String token = authorizationHeader.replace("Bearer ", "");
                RestTemplate rest = new RestTemplate();
                String url = "http://auth-serve:8082/auth/introspect";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
                form.add("token", token);

                HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
                Map<String, Object> userInfo = rest.postForObject(url, request, Map.class);

                if (userInfo == null || !"true".equals(userInfo.get("active").toString())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Token inválido ou expirado"));
                }

                // ======== PEGAR ID DO USUÁRIO DO TOKEN ========
                UUID usuarioId = UUID.fromString((String) userInfo.get("userId"));

                // ======== VERIFICAR SE O AGENDAMENTO EXISTE ========
                var agendamentoOpt = agendamentoRepository.findById(id);

                if (agendamentoOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "Agendamento não encontrado"));
                }

                Agendamentos agendamento = agendamentoOpt.get();

                // ======== VERIFICAR SE ESSE AGENDAMENTO É DO USUÁRIO ========
                if (!agendamento.getUsuario().getId().equals(usuarioId)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("error", "Você não tem permissão para excluir este agendamento"));
                }

                // ======== DELETAR ========
                agendamentoRepository.delete(agendamento);

                return ResponseEntity.noContent().build(); // 204

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Erro ao deletar agendamento", "details", e.getMessage()));
            }
        }



}

