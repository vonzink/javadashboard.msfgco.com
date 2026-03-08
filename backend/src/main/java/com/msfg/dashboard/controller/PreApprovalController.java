package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.PreApproval;
import com.msfg.dashboard.service.PreApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pre-approvals")
public class PreApprovalController {

    private final PreApprovalService preApprovalService;

    public PreApprovalController(PreApprovalService preApprovalService) {
        this.preApprovalService = preApprovalService;
    }

    @GetMapping
    public ResponseEntity<List<PreApproval>> listAll() {
        return ResponseEntity.ok(preApprovalService.findAll());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        return ResponseEntity.ok(preApprovalService.getSummary());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PreApproval> getById(@PathVariable Long id) {
        return ResponseEntity.ok(preApprovalService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PreApproval> create(@Valid @RequestBody PreApproval preApproval) {
        return ResponseEntity.status(HttpStatus.CREATED).body(preApprovalService.create(preApproval));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PreApproval> update(@PathVariable Long id,
                                              @Valid @RequestBody PreApproval preApproval) {
        return ResponseEntity.ok(preApprovalService.update(id, preApproval));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        preApprovalService.delete(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
