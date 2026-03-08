package com.msfg.dashboard.security;

import com.msfg.dashboard.model.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUser {

    public static User current() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    public static Long currentId() {
        User user = current();
        return user != null ? user.getId() : null;
    }

    public static boolean isAdmin() {
        User user = current();
        return user != null && "admin".equalsIgnoreCase(user.getRole());
    }

    public static boolean hasRole(String... roles) {
        User user = current();
        if (user == null) return false;
        for (String role : roles) {
            if (role.equalsIgnoreCase(user.getRole())) return true;
        }
        return false;
    }
}
