package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.Pipeline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PipelineRepository extends JpaRepository<Pipeline, Long> {
    List<Pipeline> findAllByOrderByUpdatedAtDesc();
    List<Pipeline> findByStatusAndLoanOfficerId(String status, Long loanOfficerId);
    List<Pipeline> findByStatus(String status);
    List<Pipeline> findByLoanOfficerId(Long loanOfficerId);
}
