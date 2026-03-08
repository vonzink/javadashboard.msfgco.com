package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.FundedLoan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FundedLoanRepository extends JpaRepository<FundedLoan, Long> {
    List<FundedLoan> findAllByOrderByFundingDateDesc();
    List<FundedLoan> findByLoId(Long loId);
}
