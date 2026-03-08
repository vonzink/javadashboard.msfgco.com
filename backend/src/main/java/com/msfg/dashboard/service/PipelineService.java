package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.Pipeline;
import com.msfg.dashboard.repository.PipelineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PipelineService {

    private final PipelineRepository pipelineRepository;

    public PipelineService(PipelineRepository pipelineRepository) {
        this.pipelineRepository = pipelineRepository;
    }

    public List<Pipeline> findAll(String status, Long loanOfficerId) {
        if (status != null && loanOfficerId != null) {
            return pipelineRepository.findByStatusAndLoanOfficerId(status, loanOfficerId);
        } else if (status != null) {
            return pipelineRepository.findByStatus(status);
        } else if (loanOfficerId != null) {
            return pipelineRepository.findByLoanOfficerId(loanOfficerId);
        }
        return pipelineRepository.findAll();
    }

    public Map<String, Object> getSummary() {
        List<Pipeline> all = pipelineRepository.findAll();
        long totalCount = all.size();
        BigDecimal totalVolume = all.stream()
                .map(Pipeline::getLoanAmount)
                .filter(a -> a != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> byStatus = all.stream()
                .filter(p -> p.getStatus() != null)
                .collect(Collectors.groupingBy(Pipeline::getStatus, Collectors.counting()));

        return Map.of(
                "totalCount", totalCount,
                "totalVolume", totalVolume,
                "byStatus", byStatus
        );
    }

    public Pipeline findById(Long id) {
        return pipelineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline", id));
    }

    @Transactional
    public Pipeline create(Pipeline pipeline) {
        return pipelineRepository.save(pipeline);
    }

    @Transactional
    public Pipeline update(Long id, Pipeline updates) {
        Pipeline pipeline = pipelineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline", id));

        if (updates.getBorrowerName() != null) pipeline.setBorrowerName(updates.getBorrowerName());
        if (updates.getLoanAmount() != null) pipeline.setLoanAmount(updates.getLoanAmount());
        if (updates.getStatus() != null) pipeline.setStatus(updates.getStatus());
        if (updates.getLoanType() != null) pipeline.setLoanType(updates.getLoanType());
        if (updates.getLoanPurpose() != null) pipeline.setLoanPurpose(updates.getLoanPurpose());
        if (updates.getPropertyAddress() != null) pipeline.setPropertyAddress(updates.getPropertyAddress());
        if (updates.getEstCloseDate() != null) pipeline.setEstCloseDate(updates.getEstCloseDate());
        if (updates.getNotes() != null) pipeline.setNotes(updates.getNotes());

        return pipelineRepository.save(pipeline);
    }

    @Transactional
    public void delete(Long id) {
        Pipeline pipeline = pipelineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline", id));
        pipelineRepository.delete(pipeline);
    }
}
