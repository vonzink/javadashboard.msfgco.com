package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.User;
import com.msfg.dashboard.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> findAllUsers() {
        return userRepository.findAllByOrderByNameAsc();
    }

    @Transactional
    public User createUser(Map<String, Object> userData) {
        String email = (String) userData.get("email");
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (userRepository.existsByEmail(email.toLowerCase())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String name = (String) userData.get("name");
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        String password = (String) userData.get("password");
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        String role = (String) userData.getOrDefault("role", "user");
        String initials = (String) userData.get("initials");
        if (initials == null || initials.isBlank()) {
            initials = generateInitials(name);
        }

        User user = User.builder()
                .email(email.toLowerCase())
                .name(name)
                .initials(initials)
                .role(role)
                .passwordHash(passwordEncoder.encode(password))
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, Map<String, Object> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("email")) user.setEmail(((String) updates.get("email")).toLowerCase());
        if (updates.containsKey("role")) user.setRole((String) updates.get("role"));
        if (updates.containsKey("initials")) user.setInitials((String) updates.get("initials"));

        if (updates.containsKey("password")) {
            String newPassword = (String) updates.get("password");
            if (newPassword != null && !newPassword.isBlank()) {
                user.setPasswordHash(passwordEncoder.encode(newPassword));
            }
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        userRepository.delete(user);
    }

    private String generateInitials(String name) {
        if (name == null || name.isBlank()) return "";
        String[] parts = name.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) sb.append(Character.toUpperCase(part.charAt(0)));
        }
        return sb.toString();
    }
}
