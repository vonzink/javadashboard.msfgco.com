package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.UserIntegration;
import com.msfg.dashboard.repository.UserIntegrationRepository;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class IntegrationService {

    private final UserIntegrationRepository userIntegrationRepository;

    public IntegrationService(UserIntegrationRepository userIntegrationRepository) {
        this.userIntegrationRepository = userIntegrationRepository;
    }

    public List<UserIntegration> findAllForCurrentUser() {
        Long userId = SecurityUser.currentId();
        if (userId == null) {
            throw new IllegalArgumentException("User must be authenticated");
        }
        return userIntegrationRepository.findByUserId(userId);
    }

    @Transactional
    public UserIntegration createOrUpdate(String serviceName, UserIntegration integration) {
        Long userId = SecurityUser.currentId();
        if (userId == null) {
            throw new IllegalArgumentException("User must be authenticated");
        }

        UserIntegration existing = userIntegrationRepository
                .findByUserIdAndServiceName(userId, serviceName)
                .orElse(null);

        if (existing != null) {
            existing.setAccessToken(integration.getAccessToken());
            existing.setRefreshToken(integration.getRefreshToken());
            existing.setSettings(integration.getSettings());
            return userIntegrationRepository.save(existing);
        }

        integration.setUserId(userId);
        integration.setServiceName(serviceName);
        return userIntegrationRepository.save(integration);
    }

    public Map<String, Object> testConnection(String serviceName) {
        Long userId = SecurityUser.currentId();
        if (userId == null) {
            throw new IllegalArgumentException("User must be authenticated");
        }

        boolean exists = userIntegrationRepository.findByUserIdAndServiceName(userId, serviceName).isPresent();

        return Map.of(
                "service", serviceName,
                "connected", exists,
                "testedAt", LocalDateTime.now().toString(),
                "message", exists ? "Connection test passed (stubbed)" : "No integration configured"
        );
    }

    @Transactional
    public void delete(String serviceName) {
        Long userId = SecurityUser.currentId();
        if (userId == null) {
            throw new IllegalArgumentException("User must be authenticated");
        }

        UserIntegration integration = userIntegrationRepository
                .findByUserIdAndServiceName(userId, serviceName)
                .orElseThrow(() -> new ResourceNotFoundException("Integration", serviceName));

        userIntegrationRepository.delete(integration);
    }
}
