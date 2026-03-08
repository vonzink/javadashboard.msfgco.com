package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.LendingpadLoan;
import com.msfg.dashboard.service.LendingpadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lendingpad")
public class LendingpadController {

    private final LendingpadService lendingpadService;

    public LendingpadController(LendingpadService lendingpadService) {
        this.lendingpadService = lendingpadService;
    }

    @GetMapping
    public ResponseEntity<List<LendingpadLoan>> list() {
        return ResponseEntity.ok(lendingpadService.findAll());
    }
}
