package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.FundedLoan;
import com.msfg.dashboard.service.FundedLoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/funded-loans")
public class FundedLoanController {

    private final FundedLoanService fundedLoanService;

    public FundedLoanController(FundedLoanService fundedLoanService) {
        this.fundedLoanService = fundedLoanService;
    }

    @GetMapping
    public ResponseEntity<List<FundedLoan>> listAll() {
        return ResponseEntity.ok(fundedLoanService.findAll());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        return ResponseEntity.ok(fundedLoanService.getSummary());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FundedLoan> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fundedLoanService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        fundedLoanService.delete(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
