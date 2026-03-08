package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.HandbookDocument;
import com.msfg.dashboard.model.entity.HandbookSection;
import com.msfg.dashboard.repository.HandbookDocumentRepository;
import com.msfg.dashboard.repository.HandbookSectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HandbookService {

    private final HandbookDocumentRepository handbookDocumentRepository;
    private final HandbookSectionRepository handbookSectionRepository;

    public HandbookService(HandbookDocumentRepository handbookDocumentRepository,
                           HandbookSectionRepository handbookSectionRepository) {
        this.handbookDocumentRepository = handbookDocumentRepository;
        this.handbookSectionRepository = handbookSectionRepository;
    }

    public List<HandbookDocument> findAllDocuments() {
        return handbookDocumentRepository.findAll();
    }

    public HandbookSection findSectionBySlug(String docSlug, String sectionSlug) {
        HandbookDocument doc = handbookDocumentRepository.findBySlug(docSlug)
                .orElseThrow(() -> new ResourceNotFoundException("HandbookDocument", docSlug));

        return handbookSectionRepository.findByDocumentIdAndSlug(doc.getId(), sectionSlug)
                .orElseThrow(() -> new ResourceNotFoundException("HandbookSection", sectionSlug));
    }

    public List<HandbookSection> search(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Search query is required");
        }
        return handbookSectionRepository.findByContentOrTitleContaining(query);
    }

    @Transactional
    public HandbookSection updateSection(Long id, HandbookSection updates) {
        HandbookSection section = handbookSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HandbookSection", id));

        if (updates.getTitle() != null) section.setTitle(updates.getTitle());
        if (updates.getContent() != null) section.setContent(updates.getContent());
        if (updates.getSlug() != null) section.setSlug(updates.getSlug());
        if (updates.getSortOrder() != null) section.setSortOrder(updates.getSortOrder());

        return handbookSectionRepository.save(section);
    }

    @Transactional
    public HandbookSection createSection(Long docId, HandbookSection section) {
        HandbookDocument document = handbookDocumentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("HandbookDocument", docId));

        section.setDocument(document);
        return handbookSectionRepository.save(section);
    }

    @Transactional
    public void deleteSection(Long id) {
        HandbookSection section = handbookSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HandbookSection", id));
        handbookSectionRepository.delete(section);
    }
}
