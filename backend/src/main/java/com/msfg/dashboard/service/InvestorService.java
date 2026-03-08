package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.*;
import com.msfg.dashboard.repository.*;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class InvestorService {

    private final InvestorRepository investorRepository;
    private final InvestorTeamRepository investorTeamRepository;
    private final InvestorLenderIdRepository investorLenderIdRepository;
    private final InvestorMortgageeClauseRepository investorMortgageeClauseRepository;
    private final InvestorLinkRepository investorLinkRepository;

    public InvestorService(InvestorRepository investorRepository,
                           InvestorTeamRepository investorTeamRepository,
                           InvestorLenderIdRepository investorLenderIdRepository,
                           InvestorMortgageeClauseRepository investorMortgageeClauseRepository,
                           InvestorLinkRepository investorLinkRepository) {
        this.investorRepository = investorRepository;
        this.investorTeamRepository = investorTeamRepository;
        this.investorLenderIdRepository = investorLenderIdRepository;
        this.investorMortgageeClauseRepository = investorMortgageeClauseRepository;
        this.investorLinkRepository = investorLinkRepository;
    }

    public List<Investor> findAll() {
        return investorRepository.findAll();
    }

    public Investor findByKey(String investorKey) {
        return investorRepository.findByInvestorKey(investorKey)
                .orElseThrow(() -> new ResourceNotFoundException("Investor", investorKey));
    }

    @Transactional
    public Investor create(Investor investor) {
        return investorRepository.save(investor);
    }

    @Transactional
    public Investor update(Long id, Map<String, Object> updates) {
        Investor investor = investorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investor", id));

        boolean isAdmin = SecurityUser.isAdmin();

        if (isAdmin) {
            if (updates.containsKey("name")) investor.setName((String) updates.get("name"));
            if (updates.containsKey("investorKey")) investor.setInvestorKey((String) updates.get("investorKey"));
            if (updates.containsKey("logoUrl")) investor.setLogoUrl((String) updates.get("logoUrl"));
            if (updates.containsKey("status")) investor.setStatus((String) updates.get("status"));
        }

        // All users can update notes
        if (updates.containsKey("notes")) {
            investor.setNotes((String) updates.get("notes"));
        }

        return investorRepository.save(investor);
    }

    public Investor findByIdOrKey(String idOrKey) {
        try {
            Long id = Long.parseLong(idOrKey);
            return investorRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Investor", idOrKey));
        } catch (NumberFormatException e) {
            return investorRepository.findByInvestorKey(idOrKey)
                    .orElseThrow(() -> new ResourceNotFoundException("Investor", idOrKey));
        }
    }

    @Transactional
    public Investor updateByIdOrKey(String idOrKey, Map<String, Object> updates) {
        Investor investor = findByIdOrKey(idOrKey);
        return update(investor.getId(), updates);
    }

    @Transactional
    public void deleteByIdOrKey(String idOrKey) {
        Investor investor = findByIdOrKey(idOrKey);
        investorRepository.delete(investor);
    }

    @Transactional
    public List<InvestorTeam> replaceTeamMembers(Long investorId, List<InvestorTeam> members) {
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor", investorId));
        investorTeamRepository.deleteByInvestorId(investorId);
        members.forEach(m -> m.setInvestor(investor));
        return investorTeamRepository.saveAll(members);
    }

    @Transactional
    public List<InvestorLenderId> upsertLenderIds(Long investorId, List<InvestorLenderId> lenderIds) {
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor", investorId));
        investorLenderIdRepository.deleteByInvestorId(investorId);
        lenderIds.forEach(lid -> lid.setInvestor(investor));
        return investorLenderIdRepository.saveAll(lenderIds);
    }

    @Transactional
    public List<InvestorMortgageeClause> replaceClauses(Long investorId, List<InvestorMortgageeClause> clauses) {
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor", investorId));
        investorMortgageeClauseRepository.deleteByInvestorId(investorId);
        clauses.forEach(c -> c.setInvestor(investor));
        return investorMortgageeClauseRepository.saveAll(clauses);
    }

    @Transactional
    public List<InvestorLink> replaceLinks(Long investorId, List<InvestorLink> links) {
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investor", investorId));
        investorLinkRepository.deleteByInvestorId(investorId);
        links.forEach(l -> l.setInvestor(investor));
        return investorLinkRepository.saveAll(links);
    }
}
