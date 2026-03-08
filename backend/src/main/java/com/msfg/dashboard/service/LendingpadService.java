package com.msfg.dashboard.service;

import com.msfg.dashboard.model.entity.LendingpadLoan;
import com.msfg.dashboard.repository.LendingpadLoanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LendingpadService {

    private final LendingpadLoanRepository lendingpadLoanRepository;

    public LendingpadService(LendingpadLoanRepository lendingpadLoanRepository) {
        this.lendingpadLoanRepository = lendingpadLoanRepository;
    }

    public List<LendingpadLoan> findAll() {
        return lendingpadLoanRepository.findAll();
    }
}
