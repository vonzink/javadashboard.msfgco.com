package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.InvestorLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestorLinkRepository extends JpaRepository<InvestorLink, Long> {
    List<InvestorLink> findByInvestorId(Long investorId);
    void deleteByInvestorId(Long investorId);
}
