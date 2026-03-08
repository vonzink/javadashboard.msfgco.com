package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.InvestorTeam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestorTeamRepository extends JpaRepository<InvestorTeam, Long> {
    List<InvestorTeam> findByInvestorIdOrderBySortOrderAsc(Long investorId);
    void deleteByInvestorId(Long investorId);
}
