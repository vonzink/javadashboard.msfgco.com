package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.PreApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreApprovalRepository extends JpaRepository<PreApproval, Long> {
    List<PreApproval> findByStatus(String status);
    List<PreApproval> findByAssignedLoId(Long assignedLoId);
}
