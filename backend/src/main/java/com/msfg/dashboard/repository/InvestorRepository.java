package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.Investor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvestorRepository extends JpaRepository<Investor, Long> {
    Optional<Investor> findByInvestorKey(String investorKey);
    List<Investor> findAllByOrderByNameAsc();
    List<Investor> findByIsActiveTrue();
}
