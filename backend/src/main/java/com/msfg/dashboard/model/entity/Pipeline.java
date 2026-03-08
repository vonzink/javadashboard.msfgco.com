package com.msfg.dashboard.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pipeline")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Pipeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loan_number", length = 100)
    private String loanNumber;

    @Column(name = "client_name", nullable = false)
    private String borrowerName;

    @Column(name = "loan_amount", precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "loan_type", length = 100)
    private String loanType;

    @Column(length = 100)
    private String stage;

    @Column(name = "target_close_date")
    private LocalDate estCloseDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_lo_id")
    private User loanOfficer;

    @Column(name = "assigned_lo_name")
    private String assignedLoName;

    private String investor;

    @Column(name = "investor_id")
    private Long investorId;

    @Column(length = 100)
    @Builder.Default
    private String status = "On Track";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "loan_status", length = 150)
    private String loanStatus;

    private String lender;

    @Column(name = "subject_property", length = 500)
    private String propertyAddress;

    @Column(length = 50)
    private String rate;

    @Column(name = "appraisal_status", length = 150)
    private String appraisalStatus;

    @Column(name = "loan_purpose", length = 150)
    private String loanPurpose;

    @Column(length = 150)
    private String occupancy;

    @Column(name = "title_status", length = 150)
    private String titleStatus;

    @Column(name = "hoi_status", length = 150)
    private String hoiStatus;

    @Column(name = "loan_estimate", length = 150)
    private String loanEstimate;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Column(name = "lock_expiration_date")
    private LocalDate lockExpirationDate;

    @Column(name = "closing_date")
    private LocalDate closingDate;

    @Column(name = "funding_date")
    private LocalDate fundingDate;

    @Column(name = "prelims_status", length = 150)
    private String prelimsStatus;

    @Column(name = "mini_set_status", length = 150)
    private String miniSetStatus;

    @Column(name = "cd_status", length = 150)
    private String cdStatus;

    @Column(name = "monday_item_id", length = 50)
    private String mondayItemId;

    @Column(name = "monday_board_id", length = 50)
    private String mondayBoardId;

    @Column(name = "source_system", length = 100)
    @Builder.Default
    private String source = "manual";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
