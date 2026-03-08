package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.User;
import com.msfg.dashboard.model.entity.UserProfile;
import com.msfg.dashboard.repository.UserProfileRepository;
import com.msfg.dashboard.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public UserService(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public List<User> getDirectory() {
        return userRepository.findAllByOrderByNameAsc();
    }

    public Map<String, Object> getContactCard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);

        Map<String, Object> contactCard = new HashMap<>();
        contactCard.put("id", user.getId());
        contactCard.put("name", user.getName());
        contactCard.put("email", user.getEmail());
        contactCard.put("initials", user.getInitials());
        contactCard.put("role", user.getRole());

        if (profile != null) {
            contactCard.put("phone", profile.getPhone());
            contactCard.put("title", profile.getTitle());
            contactCard.put("department", profile.getDepartment());
            contactCard.put("avatarUrl", profile.getAvatarUrl());
            contactCard.put("bio", profile.getBio());
            contactCard.put("nmlsId", profile.getNmlsId());
        }

        return contactCard;
    }
}
