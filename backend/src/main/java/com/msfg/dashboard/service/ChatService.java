package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.ChatMessage;
import com.msfg.dashboard.model.entity.ChatTag;
import com.msfg.dashboard.model.entity.User;
import com.msfg.dashboard.repository.ChatMessageRepository;
import com.msfg.dashboard.repository.ChatTagRepository;
import com.msfg.dashboard.security.SecurityUser;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatTagRepository chatTagRepository;

    public ChatService(ChatMessageRepository chatMessageRepository, ChatTagRepository chatTagRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatTagRepository = chatTagRepository;
    }

    public List<ChatMessage> findMessages(int limit) {
        return chatMessageRepository.findAll(
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
    }

    @Transactional
    public ChatMessage createMessage(ChatMessage message) {
        User currentUser = SecurityUser.current();
        if (currentUser == null) {
            throw new IllegalArgumentException("User must be authenticated to send messages");
        }
        message.setUser(currentUser);
        return chatMessageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(Long id) {
        ChatMessage message = chatMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ChatMessage", id));
        chatMessageRepository.delete(message);
    }

    public List<ChatTag> findAllTags() {
        return chatTagRepository.findAll();
    }

    @Transactional
    public ChatTag createTag(ChatTag tag) {
        return chatTagRepository.save(tag);
    }

    @Transactional
    public void deleteTag(Long id) {
        ChatTag tag = chatTagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ChatTag", id));
        chatTagRepository.delete(tag);
    }
}
