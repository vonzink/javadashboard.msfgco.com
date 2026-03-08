package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.Pipeline;
import com.msfg.dashboard.service.PipelineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pipeline")
public class PipelineController {

    private final PipelineService pipelineService;

    public PipelineController(PipelineService pipelineService) {
        this.pipelineService = pipelineService;
    }

    @GetMapping
    public ResponseEntity<List<Pipeline>> list(@RequestParam(required = false) String status,
                                               @RequestParam(required = false) Long loanOfficerId) {
        return ResponseEntity.ok(pipelineService.findAll(status, loanOfficerId));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        return ResponseEntity.ok(pipelineService.getSummary());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pipeline> getById(@PathVariable Long id) {
        return ResponseEntity.ok(pipelineService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Pipeline> create(@Valid @RequestBody Pipeline pipeline) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pipelineService.create(pipeline));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pipeline> update(@PathVariable Long id, @Valid @RequestBody Pipeline pipeline) {
        return ResponseEntity.ok(pipelineService.update(id, pipeline));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        pipelineService.delete(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
