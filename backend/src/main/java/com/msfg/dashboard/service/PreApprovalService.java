package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.PreApproval;
import com.msfg.dashboard.repository.PreApprovalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PreApprovalService {

    private final PreApprovalRepository preApprovalRepository;

    public PreApprovalService(PreApprovalRepository preApprovalRepository) {
        this.preApprovalRepository = preApprovalRepository;
    }

    public List<PreApproval> findAll() {
        return preApprovalRepository.findAll();
    }

    public Map<String, Object> getSummary() {
        List<PreApproval> all = preApprovalRepository.findAll();
        long totalCount = all.size();

        Map<String, Long> byStatus = all.stream()
                .filter(p -> p.getStatus() != null)
                .collect(Collectors.groupingBy(PreApproval::getStatus, Collectors.counting()));

        BigDecimal totalAmount = all.stream()
                .map(PreApproval::getApprovalAmount)
                .filter(a -> a != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "totalCount", totalCount,
                "totalAmount", totalAmount,
                "byStatus", byStatus
        );
    }

    public PreApproval findById(Long id) {
        return preApprovalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PreApproval", id));
    }

    @Transactional
    public PreApproval create(PreApproval preApproval) {
        return preApprovalRepository.save(preApproval);
    }

    @Transactional
    public PreApproval update(Long id, PreApproval updates) {
        PreApproval existing = preApprovalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PreApproval", id));

        if (updates.getBorrowerName() != null) existing.setBorrowerName(updates.getBorrowerName());
        if (updates.getApprovalAmount() != null) existing.setApprovalAmount(updates.getApprovalAmount());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getLoanType() != null) existing.setLoanType(updates.getLoanType());
        if (updates.getExpirationDate() != null) existing.setExpirationDate(updates.getExpirationDate());
        if (updates.getNotes() != null) existing.setNotes(updates.getNotes());

        return preApprovalRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        PreApproval preApproval = preApprovalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PreApproval", id));
        preApprovalRepository.delete(preApproval);
    }
}
