package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tax_counties")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaxCounty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "state", nullable = false, length = 2, columnDefinition = "CHAR(2)")
    private String stateCode;

    @Column(name = "county", nullable = false, length = 100)
    private String countyName;

    @Column(name = "assessor_url", length = 500)
    private String assessorUrl;

    @Column(name = "treasurer_url", length = 500)
    private String treasurerUrl;

    @Column(name = "login_required")
    @Builder.Default
    private Boolean loginRequired = false;

    @Column(name = "known_costs_fees", length = 500)
    private String knownCostsFees;

    @Column(name = "online_portal")
    @Builder.Default
    private Boolean onlinePortal = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
