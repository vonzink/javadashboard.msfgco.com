package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.ChatMessage;
import com.msfg.dashboard.model.entity.ChatTag;
import com.msfg.dashboard.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> listMessages(@RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(chatService.findMessages(limit));
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> createMessage(@Valid @RequestBody ChatMessage message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.createMessage(message));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteMessage(@PathVariable Long id) {
        chatService.deleteMessage(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/tags")
    public ResponseEntity<List<ChatTag>> listTags() {
        return ResponseEntity.ok(chatService.findAllTags());
    }

    @PostMapping("/tags")
    public ResponseEntity<ChatTag> createTag(@Valid @RequestBody ChatTag tag) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.createTag(tag));
    }

    @DeleteMapping("/tags/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteTag(@PathVariable Long id) {
        chatService.deleteTag(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
