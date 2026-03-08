package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.User;
import com.msfg.dashboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/directory")
    public ResponseEntity<List<User>> directory() {
        return ResponseEntity.ok(userService.getDirectory());
    }

    @GetMapping("/{id}/contact-card")
    public ResponseEntity<Map<String, Object>> contactCard(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getContactCard(id));
    }
}
