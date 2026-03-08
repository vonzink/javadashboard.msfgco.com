package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.Goal;
import com.msfg.dashboard.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<Goal>> list(@RequestParam(required = false) String period_type,
                                           @RequestParam(required = false) String period_value,
                                           @RequestParam(required = false) Long user_id) {
        return ResponseEntity.ok(goalService.findAll(period_type, period_value, user_id));
    }

    @PutMapping
    public ResponseEntity<List<Goal>> upsert(@Valid @RequestBody List<Goal> goals) {
        return ResponseEntity.ok(goalService.upsert(goals));
    }

    @GetMapping("/by-lo/summary")
    public ResponseEntity<List<Map<String, Object>>> summaryByLoanOfficer() {
        return ResponseEntity.ok(goalService.getSummaryByLoanOfficer());
    }
}
