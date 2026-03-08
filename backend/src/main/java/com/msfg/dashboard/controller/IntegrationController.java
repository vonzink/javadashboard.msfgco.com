package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.UserIntegration;
import com.msfg.dashboard.service.IntegrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations")
public class IntegrationController {

    private final IntegrationService integrationService;

    public IntegrationController(IntegrationService integrationService) {
        this.integrationService = integrationService;
    }

    @GetMapping
    public ResponseEntity<List<UserIntegration>> list() {
        return ResponseEntity.ok(integrationService.findAllForCurrentUser());
    }

    @PostMapping("/{service}")
    public ResponseEntity<UserIntegration> createOrUpdate(@PathVariable String service,
                                                           @Valid @RequestBody UserIntegration integration) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(integrationService.createOrUpdate(service, integration));
    }

    @PostMapping("/{service}/test")
    public ResponseEntity<Map<String, Object>> testConnection(@PathVariable String service) {
        return ResponseEntity.ok(integrationService.testConnection(service));
    }

    @DeleteMapping("/{service}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable String service) {
        integrationService.delete(service);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
