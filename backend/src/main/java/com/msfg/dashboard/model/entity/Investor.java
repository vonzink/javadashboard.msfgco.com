package com.msfg.dashboard.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "investors")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Investor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "investor_key", unique = true, nullable = false, length = 100)
    private String investorKey;

    @Column(nullable = false)
    private String name;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    @Column(name = "login_url", columnDefinition = "TEXT")
    private String loginUrl;

    @Column(name = "account_executive_name")
    private String accountExecutiveName;

    @Column(name = "account_executive_mobile", length = 50)
    private String accountExecutiveMobile;

    @Column(name = "account_executive_email")
    private String accountExecutiveEmail;

    @Column(name = "account_executive_address", columnDefinition = "TEXT")
    private String accountExecutiveAddress;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String states;

    @Column(name = "best_programs", columnDefinition = "TEXT")
    private String bestPrograms;

    @Column(name = "minimum_fico", length = 64)
    private String minimumFico;

    @Column(name = "in_house_dpa", length = 64)
    private String inHouseDpa;

    @Column(length = 128)
    private String epo;

    @Column(name = "max_comp")
    private BigDecimal maxComp;

    @Column(name = "doc_review_wire", length = 64)
    private String docReviewWire;

    @Column(name = "remote_closing_review", length = 64)
    private String remoteClosingReview;

    @Column(name = "website_url", columnDefinition = "TEXT")
    private String websiteUrl;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // Alias for isActive used by service code
    @Transient
    private String status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<InvestorTeam> team = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<InvestorLenderId> lenderIds = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<InvestorMortgageeClause> mortgageeClauses = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "investor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<InvestorLink> links = new ArrayList<>();
}
