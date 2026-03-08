package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.LendingpadLoan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LendingpadLoanRepository extends JpaRepository<LendingpadLoan, Long> {
    Optional<LendingpadLoan> findByExternalId(String externalId);
    Optional<LendingpadLoan> findByLoanNumber(String loanNumber);
}
