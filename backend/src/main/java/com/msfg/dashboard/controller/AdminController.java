package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.User;
import com.msfg.dashboard.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(adminService.findAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> userData) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createUser(userData));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                                           @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(adminService.updateUser(id, updates));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
