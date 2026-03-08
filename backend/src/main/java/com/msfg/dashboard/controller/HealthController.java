package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.dto.UserDTO;
import com.msfg.dashboard.model.entity.User;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/api/me")
    public ResponseEntity<UserDTO> me() {
        User user = SecurityUser.current();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(UserDTO.from(user));
    }
}
