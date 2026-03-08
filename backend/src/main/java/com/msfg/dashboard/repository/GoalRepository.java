package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserIdAndPeriodTypeAndPeriodValue(Long userId, String periodType, String periodValue);
    List<Goal> findByUserId(Long userId);
    List<Goal> findByPeriodTypeAndPeriodValueAndUserId(String periodType, String periodValue, Long userId);
    List<Goal> findByPeriodTypeAndPeriodValue(String periodType, String periodValue);
}
