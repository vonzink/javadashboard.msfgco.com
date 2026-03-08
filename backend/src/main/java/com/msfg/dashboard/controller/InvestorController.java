package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.*;
import com.msfg.dashboard.service.InvestorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investors")
public class InvestorController {

    private final InvestorService investorService;

    public InvestorController(InvestorService investorService) {
        this.investorService = investorService;
    }

    @GetMapping
    public ResponseEntity<List<Investor>> listAll() {
        return ResponseEntity.ok(investorService.findAll());
    }

    @GetMapping("/{key}")
    public ResponseEntity<Investor> getByKey(@PathVariable String key) {
        return ResponseEntity.ok(investorService.findByKey(key));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Investor> create(@Valid @RequestBody Investor investor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(investorService.create(investor));
    }

    @PutMapping("/{idOrKey}")
    public ResponseEntity<Investor> update(@PathVariable String idOrKey,
                                           @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(investorService.updateByIdOrKey(idOrKey, updates));
    }

    @DeleteMapping("/{idOrKey}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable String idOrKey) {
        investorService.deleteByIdOrKey(idOrKey);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PutMapping("/{id}/team")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InvestorTeam>> replaceTeam(@PathVariable Long id,
                                                          @Valid @RequestBody List<InvestorTeam> members) {
        return ResponseEntity.ok(investorService.replaceTeamMembers(id, members));
    }

    @PutMapping("/{id}/lender-ids")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InvestorLenderId>> upsertLenderIds(@PathVariable Long id,
                                                                   @Valid @RequestBody List<InvestorLenderId> lenderIds) {
        return ResponseEntity.ok(investorService.upsertLenderIds(id, lenderIds));
    }

    @PutMapping("/{id}/mortgagee-clauses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InvestorMortgageeClause>> replaceClauses(@PathVariable Long id,
                                                                         @Valid @RequestBody List<InvestorMortgageeClause> clauses) {
        return ResponseEntity.ok(investorService.replaceClauses(id, clauses));
    }

    @PutMapping("/{id}/links")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InvestorLink>> replaceLinks(@PathVariable Long id,
                                                            @Valid @RequestBody List<InvestorLink> links) {
        return ResponseEntity.ok(investorService.replaceLinks(id, links));
    }
}
