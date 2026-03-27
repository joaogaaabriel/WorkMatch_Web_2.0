        package com.workmatch.controller;

        import com.workmatch.dto.AgendaRequest;
        import com.workmatch.model.Agenda;
        import com.workmatch.model.AgendaHorarios;
        import com.workmatch.model.Profissional;
        import com.workmatch.repository.AgendaHorariosRepository;
        import com.workmatch.repository.AgendaRepository;
        import com.workmatch.repository.AgendamentoRepository;
        import com.workmatch.repository.ProfissionalRepository;

        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.http.HttpStatus;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;
        import org.springframework.transaction.annotation.Transactional;

        import java.time.LocalDate;
        import java.time.format.DateTimeFormatter;
        import java.util.List;
        import java.util.Map;
        import java.util.UUID;

        @RestController
        @RequestMapping("/api/agendas")
        @CrossOrigin("*")
        public class AgendaCadastroController {

        @Autowired
        private AgendaRepository agendaRepo;

        @Autowired
        private AgendaHorariosRepository horariosRepo;

        @Autowired
        private ProfissionalRepository profissionalRepo;

        @Autowired
        private AgendamentoRepository agendamentosRepo;

        @PostMapping("/{profissionalId}")
        public ResponseEntity<?> criarAgenda(
                @PathVariable UUID profissionalId,
                @RequestBody AgendaRequest request) {

                try {
                // Validar profissional
                Profissional profissional = profissionalRepo.findById(profissionalId)
                        .orElse(null);
                if (profissional == null) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("error", "Profissional não encontrado"));
                }

                // Validar request
                if (request == null || request.getData() == null || request.getHorarios() == null || request.getHorarios().isEmpty()) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Data e horários são obrigatórios"));
                }

                LocalDate data;
                try {
                        data = LocalDate.parse(request.getData());
                } catch (Exception e) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Formato de data inválido"));
                }

                // ✅ Verificar se já existe agenda para esse profissional na mesma data
                boolean existe = agendaRepo.existsByProfissionalIdAndData(profissional.getId(), data);
                if (existe) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(Map.of("error", "Já existe uma agenda para este profissional nesta data"));
                }

                // Criar agenda
                Agenda agenda = new Agenda();
                agenda.setData(data);
                agenda.setProfissional(profissional);
                agenda = agendaRepo.save(agenda);

                // Salvar horários
                for (String hr : request.getHorarios()) {
                        AgendaHorarios h = new AgendaHorarios();
                        h.setHorario(hr);
                        h.setAgenda(agenda);
                        horariosRepo.save(h);
                }

                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Map.of("mensagem", "Agenda e horários cadastrados com sucesso"));

                } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Erro ao criar agenda", "details", e.getMessage()));
                }
        }

        @GetMapping("/profissional/{profissionalId}")
        public ResponseEntity<?> listarAgendasPorProfissional(@PathVariable UUID profissionalId) {
        List<Agenda> agendas = agendaRepo.findByProfissionalId(profissionalId);

        List<Map<String, Object>> resposta = agendas.stream().map(a -> Map.of(
                "agendaId", a.getId(),
                "data", a.getData(),
                "horarios", horariosRepo.findByAgendaId(a.getId())
                .stream()
                .map(h -> Map.of(
                        "id", h.getId(),         // UUID do horário
                        "horario", h.getHorario() // valor do horário
                ))
                .toList()
        )).toList();

        return ResponseEntity.ok(resposta);
        }


        @GetMapping("/{agendaId}")
        public ResponseEntity<?> buscarAgendaPorId(@PathVariable UUID agendaId) {

                try {
                // 1 — Buscar agenda
                Agenda agenda = agendaRepo.findById(agendaId).orElse(null);

                if (agenda == null) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("error", "Agenda não encontrada"));
                }

                // 2 — Buscar horários
                List<String> horarios = horariosRepo.findByAgendaId(agenda.getId())
                        .stream()
                        .map(AgendaHorarios::getHorario)
                        .toList();

                // 3 — Montar resposta
                Map<String, Object> resp = Map.of(
                        "agendaId", agenda.getId(),
                        "data", agenda.getData(),
                        "horarios", horarios
                );

                return ResponseEntity.ok(resp);

                } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Erro ao buscar agenda", "details", e.getMessage()));
                }
        }

        @GetMapping("/profissionais/{profissionalId}/agendas")
        public ResponseEntity<?> listarHorariosPorDia(
                @PathVariable UUID profissionalId,
                @RequestParam String data) {

        try {
                LocalDate dia = LocalDate.parse(data);

                // Buscar agenda do dia
                Agenda agenda = agendaRepo.findByProfissionalIdAndData(profissionalId, dia)
                        .orElse(null);
                
                if (agenda == null) {
                return ResponseEntity.ok(
                        Map.of(
                                "horarios", List.of(),
                                "ocupados", List.of()
                        )
                );
                }

                // Buscar horários cadastrados
                List<String> horarios = horariosRepo.findByAgendaId(agenda.getId())
                        .stream()
                        .map(AgendaHorarios::getHorario)
                        .toList();

                // Buscar horários já agendados (formatar LocalTime)
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");

                List<String> ocupados = agendamentosRepo.findByProfissionalIdAndData(profissionalId, dia)
                        .stream()
                        .map(a -> a.getHorario().format(fmt))
                        .toList();

                return ResponseEntity.ok(
                        Map.of(
                                "horarios", horarios,
                                "ocupados", ocupados
                        )
                );

        } catch (Exception e) {
                return ResponseEntity.status(500)
                        .body(Map.of("error", "Erro ao buscar horários", "details", e.getMessage()));
        }
        }

        @PutMapping("/{agendaId}")
        @Transactional
        public ResponseEntity<?> atualizarAgenda(
                @PathVariable UUID agendaId,
                @RequestBody AgendaRequest request) {
        try {
                Agenda agenda = agendaRepo.findById(agendaId).orElse(null);
                if (agenda == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Agenda não encontrada"));
                }

                LocalDate data = LocalDate.parse(request.getData());
                agenda.setData(data);
                agendaRepo.save(agenda);

                // Atualizar horários
                horariosRepo.deleteByAgendaId(agendaId); // agora dentro de transação
                for (String hr : request.getHorarios()) {
                AgendaHorarios h = new AgendaHorarios();
                h.setHorario(hr);
                h.setAgenda(agenda);
                horariosRepo.save(h);
                }

                return ResponseEntity.ok(Map.of("mensagem", "Agenda atualizada com sucesso"));

        } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Erro ao atualizar agenda", "details", e.getMessage()));
        }
        }

        @DeleteMapping("/{agendaId}")
        @Transactional
        public ResponseEntity<?> excluirAgenda(@PathVariable UUID agendaId) {
        try {
                Agenda agenda = agendaRepo.findById(agendaId).orElse(null);
                if (agenda == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Agenda não encontrada"));
                }

                // Deleta horários primeiro
                horariosRepo.deleteByAgendaId(agendaId);

                // Depois deleta a agenda
                agendaRepo.delete(agenda);

                return ResponseEntity.ok(Map.of("mensagem", "Agenda excluída com sucesso"));
        } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Erro ao excluir agenda", "details", e.getMessage()));
        }
        }

        @DeleteMapping("/{agendaId}/horarios/{horarioId}")
        @Transactional
        public ResponseEntity<?> deleteHorario(
                @PathVariable UUID agendaId,
                @PathVariable UUID horarioId) {

        AgendaHorarios horario = horariosRepo.findById(horarioId).orElse(null);
        if (horario == null || !horario.getAgenda().getId().equals(agendaId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Horário não encontrado"));
        }

        horariosRepo.delete(horario);
        return ResponseEntity.ok(Map.of("mensagem", "Horário excluído com sucesso"));
        }










        }
