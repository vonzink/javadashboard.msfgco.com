package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.InvestorLenderId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestorLenderIdRepository extends JpaRepository<InvestorLenderId, Long> {
    List<InvestorLenderId> findByInvestorId(Long investorId);
    void deleteByInvestorId(Long investorId);
}
