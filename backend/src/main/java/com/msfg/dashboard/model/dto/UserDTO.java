package com.msfg.dashboard.model.dto;

import com.msfg.dashboard.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private String initials;
    private String role;

    public static UserDTO from(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .initials(user.getInitials())
                .role(user.getRole())
                .build();
    }
}
