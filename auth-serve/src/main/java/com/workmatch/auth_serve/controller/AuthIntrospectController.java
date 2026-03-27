    package com.workmatch.auth_serve.controller;

    import java.util.HashMap;
    import java.util.Map;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.CrossOrigin;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestHeader;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;

    import com.workmatch.auth_serve.model.UserToken;
    import com.workmatch.auth_serve.repository.UserTokenRepository;

    @RestController
    @RequestMapping("/auth")
    @CrossOrigin("*")
    public class AuthIntrospectController {

        @Autowired
        private UserTokenRepository userTokenRepository;

        
        @PostMapping("/introspect")
        public ResponseEntity<Map<String, Object>> introspect(
                @RequestParam(value = "token", required = false) String token,
                @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

            Map<String, Object> response = new HashMap<>();

            // Se veio pelo header, extrai o token removendo "Bearer "
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                token = authorizationHeader.substring(7);
            }

            if (token == null || token.isBlank()) {
                response.put("active", false);
                return ResponseEntity.ok(response);
            }

            UserToken userToken = userTokenRepository.findByToken(token);

            if (userToken == null || userToken.isExpired()) {
                response.put("active", false);
                return ResponseEntity.ok(response);
            }

            response.put("active", true);
            response.put("userId", userToken.getUserId());

            return ResponseEntity.ok(response);
        }
    }