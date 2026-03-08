package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    Optional<ApiKey> findByKeyValue(String keyValue);
    Optional<ApiKey> findByKeyValueAndActiveTrue(String keyValue);
    List<ApiKey> findByUserId(Long userId);
}
