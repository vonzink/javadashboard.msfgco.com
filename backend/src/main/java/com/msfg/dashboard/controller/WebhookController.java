package com.msfg.dashboard.controller;

import com.msfg.dashboard.service.WebhookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final WebhookService webhookService;

    public WebhookController(WebhookService webhookService) {
        this.webhookService = webhookService;
    }

    @PostMapping("/tasks")
    public ResponseEntity<Map<String, Object>> taskWebhook(
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestBody Map<String, Object> payload) {
        if (!webhookService.validateApiKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing API key"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(webhookService.processTaskWebhook(payload));
    }

    @PostMapping("/bulk/tasks")
    public ResponseEntity<Map<String, Object>> bulkTaskWebhook(
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestBody List<Map<String, Object>> payloads) {
        if (!webhookService.validateApiKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing API key"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(webhookService.processBulkTaskWebhook(payloads));
    }

    @PostMapping("/pre-approvals")
    public ResponseEntity<Map<String, Object>> preApprovalWebhook(
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestBody Map<String, Object> payload) {
        if (!webhookService.validateApiKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing API key"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(webhookService.processPreApprovalWebhook(payload));
    }

    @PostMapping("/pipeline")
    public ResponseEntity<Map<String, Object>> pipelineWebhook(
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestBody Map<String, Object> payload) {
        if (!webhookService.validateApiKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing API key"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(webhookService.processPipelineWebhook(payload));
    }

    @PostMapping("/lendingpad")
    public ResponseEntity<Map<String, Object>> lendingpadWebhook(
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestBody Map<String, Object> payload) {
        if (!webhookService.validateApiKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing API key"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(webhookService.processLendingpadWebhook(payload));
    }
}
