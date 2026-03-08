package com.msfg.dashboard.service;

import com.msfg.dashboard.model.entity.*;
import com.msfg.dashboard.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class WebhookService {

    private static final Logger log = LoggerFactory.getLogger(WebhookService.class);

    private final ApiKeyRepository apiKeyRepository;
    private final TaskRepository taskRepository;
    private final PreApprovalRepository preApprovalRepository;
    private final PipelineRepository pipelineRepository;
    private final LendingpadLoanRepository lendingpadLoanRepository;

    public WebhookService(ApiKeyRepository apiKeyRepository,
                          TaskRepository taskRepository,
                          PreApprovalRepository preApprovalRepository,
                          PipelineRepository pipelineRepository,
                          LendingpadLoanRepository lendingpadLoanRepository) {
        this.apiKeyRepository = apiKeyRepository;
        this.taskRepository = taskRepository;
        this.preApprovalRepository = preApprovalRepository;
        this.pipelineRepository = pipelineRepository;
        this.lendingpadLoanRepository = lendingpadLoanRepository;
    }

    public boolean validateApiKey(String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            return false;
        }
        return apiKeyRepository.findByKeyValue(apiKey)
                .map(key -> key.getActive() != null && key.getActive())
                .orElse(false);
    }

    @Transactional
    public Map<String, Object> processTaskWebhook(Map<String, Object> payload) {
        log.info("Processing task webhook: {}", payload);

        Task task = new Task();
        task.setTitle((String) payload.get("title"));
        task.setDescription((String) payload.get("description"));
        task.setStatus((String) payload.getOrDefault("status", "pending"));
        task.setPriority((String) payload.getOrDefault("priority", "medium"));
        task.setSource("webhook");

        task = taskRepository.save(task);

        return Map.of(
                "success", true,
                "taskId", task.getId(),
                "message", "Task created from webhook"
        );
    }

    @Transactional
    public Map<String, Object> processBulkTaskWebhook(List<Map<String, Object>> payloads) {
        log.info("Processing bulk task webhook: {} tasks", payloads.size());

        List<Long> createdIds = new ArrayList<>();
        for (Map<String, Object> payload : payloads) {
            Task task = new Task();
            task.setTitle((String) payload.get("title"));
            task.setDescription((String) payload.get("description"));
            task.setStatus((String) payload.getOrDefault("status", "pending"));
            task.setPriority((String) payload.getOrDefault("priority", "medium"));
            task.setSource("webhook");
            task = taskRepository.save(task);
            createdIds.add(task.getId());
        }

        return Map.of(
                "success", true,
                "createdCount", createdIds.size(),
                "taskIds", createdIds,
                "message", "Bulk tasks created from webhook"
        );
    }

    @Transactional
    public Map<String, Object> processPreApprovalWebhook(Map<String, Object> payload) {
        log.info("Processing pre-approval webhook: {}", payload);

        PreApproval preApproval = new PreApproval();
        preApproval.setBorrowerName((String) payload.get("borrowerName"));
        preApproval.setStatus((String) payload.getOrDefault("status", "pending"));
        preApproval.setNotes((String) payload.get("notes"));
        preApproval.setSource("webhook");

        preApproval = preApprovalRepository.save(preApproval);

        return Map.of(
                "success", true,
                "preApprovalId", preApproval.getId(),
                "message", "Pre-approval created from webhook"
        );
    }

    @Transactional
    public Map<String, Object> processPipelineWebhook(Map<String, Object> payload) {
        log.info("Processing pipeline webhook: {}", payload);

        Pipeline pipeline = new Pipeline();
        pipeline.setBorrowerName((String) payload.get("borrowerName"));
        pipeline.setStatus((String) payload.getOrDefault("status", "in_progress"));
        pipeline.setLoanType((String) payload.get("loanType"));
        pipeline.setPropertyAddress((String) payload.get("propertyAddress"));
        pipeline.setNotes((String) payload.get("notes"));
        pipeline.setSource("webhook");

        pipeline = pipelineRepository.save(pipeline);

        return Map.of(
                "success", true,
                "pipelineId", pipeline.getId(),
                "message", "Pipeline entry created from webhook"
        );
    }

    @Transactional
    public Map<String, Object> processLendingpadWebhook(Map<String, Object> payload) {
        log.info("Processing lendingpad webhook: {}", payload);

        LendingpadLoan loan = new LendingpadLoan();
        loan.setBorrowerName((String) payload.get("borrowerName"));
        loan.setLoanNumber((String) payload.get("loanNumber"));
        loan.setStatus((String) payload.getOrDefault("status", "active"));
        loan.setSource("webhook");

        loan = lendingpadLoanRepository.save(loan);

        return Map.of(
                "success", true,
                "loanId", loan.getId(),
                "message", "Lendingpad loan created from webhook"
        );
    }
}
