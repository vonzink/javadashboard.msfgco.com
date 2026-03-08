package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.UserIntegration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserIntegrationRepository extends JpaRepository<UserIntegration, Long> {
    List<UserIntegration> findByUserId(Long userId);
    List<UserIntegration> findByUserIdAndIsActiveTrue(Long userId);
    Optional<UserIntegration> findByUserIdAndServiceName(Long userId, String serviceName);
}
