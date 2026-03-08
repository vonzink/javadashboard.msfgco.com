package com.msfg.dashboard.repository;

import com.msfg.dashboard.model.entity.TaxCounty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaxCountyRepository extends JpaRepository<TaxCounty, Long> {
    List<TaxCounty> findByStateCodeOrderByCountyNameAsc(String stateCode);
}
