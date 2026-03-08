package com.msfg.dashboard.service;

import com.msfg.dashboard.model.entity.Goal;
import com.msfg.dashboard.repository.GoalRepository;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Goal> findAll(String periodType, String periodValue, Long userId) {
        if (periodType != null && periodValue != null && userId != null) {
            return goalRepository.findByPeriodTypeAndPeriodValueAndUserId(periodType, periodValue, userId);
        } else if (periodType != null && periodValue != null) {
            return goalRepository.findByPeriodTypeAndPeriodValue(periodType, periodValue);
        } else if (userId != null) {
            return goalRepository.findByUserId(userId);
        }
        return goalRepository.findAll();
    }

    @Transactional
    public List<Goal> upsert(List<Goal> goals) {
        List<Goal> saved = new ArrayList<>();
        for (Goal goal : goals) {
            if (goal.getId() != null) {
                Goal existing = goalRepository.findById(goal.getId()).orElse(null);
                if (existing != null) {
                    existing.setGoalUnits(goal.getGoalUnits());
                    existing.setGoalVolume(goal.getGoalVolume());
                    existing.setPeriodType(goal.getPeriodType());
                    existing.setPeriodValue(goal.getPeriodValue());
                    saved.add(goalRepository.save(existing));
                    continue;
                }
            }
            if (goal.getUserId() == null) {
                goal.setUserId(SecurityUser.currentId());
            }
            saved.add(goalRepository.save(goal));
        }
        return saved;
    }

    public List<Map<String, Object>> getSummaryByLoanOfficer() {
        List<Goal> allGoals = goalRepository.findAll();
        return allGoals.stream()
                .collect(Collectors.groupingBy(Goal::getUserId))
                .entrySet().stream()
                .map(entry -> {
                    Long userId = entry.getKey();
                    List<Goal> userGoals = entry.getValue();
                    int totalUnits = userGoals.stream()
                            .mapToInt(g -> g.getGoalUnits() != null ? g.getGoalUnits() : 0)
                            .sum();
                    double totalVolume = userGoals.stream()
                            .mapToDouble(g -> g.getGoalVolume() != null ? g.getGoalVolume().doubleValue() : 0)
                            .sum();
                    return Map.<String, Object>of(
                            "userId", userId,
                            "totalGoalUnits", totalUnits,
                            "totalGoalVolume", totalVolume,
                            "goalCount", userGoals.size()
                    );
                })
                .collect(Collectors.toList());
    }
}
