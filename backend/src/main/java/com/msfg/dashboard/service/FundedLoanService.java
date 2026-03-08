package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.FundedLoan;
import com.msfg.dashboard.repository.FundedLoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FundedLoanService {

    private final FundedLoanRepository fundedLoanRepository;

    public FundedLoanService(FundedLoanRepository fundedLoanRepository) {
        this.fundedLoanRepository = fundedLoanRepository;
    }

    public List<FundedLoan> findAll() {
        return fundedLoanRepository.findAll();
    }

    public Map<String, Object> getSummary() {
        List<FundedLoan> all = fundedLoanRepository.findAll();
        long totalCount = all.size();
        BigDecimal totalVolume = all.stream()
                .map(FundedLoan::getLoanAmount)
                .filter(a -> a != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> byLoanType = all.stream()
                .filter(f -> f.getLoanType() != null)
                .collect(Collectors.groupingBy(FundedLoan::getLoanType, Collectors.counting()));

        return Map.of(
                "totalCount", totalCount,
                "totalVolume", totalVolume,
                "byLoanType", byLoanType
        );
    }

    public FundedLoan findById(Long id) {
        return fundedLoanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FundedLoan", id));
    }

    @Transactional
    public void delete(Long id) {
        FundedLoan fundedLoan = fundedLoanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FundedLoan", id));
        fundedLoanRepository.delete(fundedLoan);
    }
}
