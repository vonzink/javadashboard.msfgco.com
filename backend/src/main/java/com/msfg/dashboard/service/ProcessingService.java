package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.ProcessingRecord;
import com.msfg.dashboard.model.entity.ProcessingLink;
import com.msfg.dashboard.repository.ProcessingRecordRepository;
import com.msfg.dashboard.repository.ProcessingLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProcessingService {

    private final ProcessingRecordRepository processingRecordRepository;
    private final ProcessingLinkRepository processingLinkRepository;

    public ProcessingService(ProcessingRecordRepository processingRecordRepository,
                             ProcessingLinkRepository processingLinkRepository) {
        this.processingRecordRepository = processingRecordRepository;
        this.processingLinkRepository = processingLinkRepository;
    }

    // --- Processing Records ---

    public List<ProcessingRecord> findAllRecords() {
        return processingRecordRepository.findAll();
    }

    @Transactional
    public ProcessingRecord createRecord(ProcessingRecord record) {
        return processingRecordRepository.save(record);
    }

    @Transactional
    public ProcessingRecord updateRecord(Long id, ProcessingRecord updates) {
        ProcessingRecord record = processingRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProcessingRecord", id));

        if (updates.getBorrowerName() != null) record.setBorrowerName(updates.getBorrowerName());
        if (updates.getLoanNumber() != null) record.setLoanNumber(updates.getLoanNumber());
        if (updates.getStatus() != null) record.setStatus(updates.getStatus());
        if (updates.getProcessor() != null) record.setProcessor(updates.getProcessor());
        if (updates.getNotes() != null) record.setNotes(updates.getNotes());

        return processingRecordRepository.save(record);
    }

    @Transactional
    public void deleteRecord(Long id) {
        ProcessingRecord record = processingRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProcessingRecord", id));
        processingRecordRepository.delete(record);
    }

    // --- Processing Links ---

    public List<ProcessingLink> findAllLinks() {
        return processingLinkRepository.findAll();
    }

    @Transactional
    public ProcessingLink createLink(ProcessingLink link) {
        return processingLinkRepository.save(link);
    }

    @Transactional
    public ProcessingLink updateLink(Long id, ProcessingLink updates) {
        ProcessingLink link = processingLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProcessingLink", id));

        if (updates.getName() != null) link.setName(updates.getName());
        if (updates.getUrl() != null) link.setUrl(updates.getUrl());
        if (updates.getCategory() != null) link.setCategory(updates.getCategory());
        if (updates.getTab() != null) link.setTab(updates.getTab());
        if (updates.getEmail() != null) link.setEmail(updates.getEmail());
        if (updates.getPhone() != null) link.setPhone(updates.getPhone());
        if (updates.getFax() != null) link.setFax(updates.getFax());

        return processingLinkRepository.save(link);
    }

    @Transactional
    public void deleteLink(Long id) {
        ProcessingLink link = processingLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProcessingLink", id));
        processingLinkRepository.delete(link);
    }
}
