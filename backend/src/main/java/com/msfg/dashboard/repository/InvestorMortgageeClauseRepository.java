package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.InvestorMortgageeClause;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestorMortgageeClauseRepository extends JpaRepository<InvestorMortgageeClause, Long> {
    List<InvestorMortgageeClause> findByInvestorId(Long investorId);
    void deleteByInvestorId(Long investorId);
}
