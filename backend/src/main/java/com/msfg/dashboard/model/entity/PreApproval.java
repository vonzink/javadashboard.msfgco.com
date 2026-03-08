package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pre_approvals")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PreApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_name")
    private String borrowerName;

    @Column(name = "loan_amount", precision = 15, scale = 2)
    private BigDecimal approvalAmount;

    @Column(name = "pre_approval_date")
    private LocalDate preApprovalDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(nullable = false)
    @Builder.Default
    private String status = "active";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_lo_id")
    private User assignedLo;

    @Column(name = "assigned_lo_name")
    private String assignedLoName;

    @Column(name = "property_address", length = 500)
    private String propertyAddress;

    @Column(name = "loan_type", length = 100)
    private String loanType;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "source_system", length = 50)
    @Builder.Default
    private String source = "manual";

    @Column(name = "monday_item_id", length = 50)
    private String mondayItemId;

    @Column(name = "source_board_id", length = 50)
    private String mondayBoardId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
