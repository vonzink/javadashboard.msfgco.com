package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "period_type")
    private String periodType;

    @Column(name = "period_value", length = 50)
    private String periodValue;

    @Column(name = "goal_type", length = 50)
    private String goalType;

    @Column(name = "goal_units")
    private Integer goalUnits;

    @Column(name = "goal_volume", precision = 15, scale = 2)
    private BigDecimal goalVolume;

    @Column(name = "current_value", precision = 15, scale = 2)
    private BigDecimal currentValue;

    @Column(name = "target_value", precision = 15, scale = 2)
    private BigDecimal targetValue;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
