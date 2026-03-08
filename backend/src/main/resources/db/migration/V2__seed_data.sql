-- ============================================================
-- MSFG Dashboard - Flyway V2: Seed Data
-- Initial admin user, preferences, and default chat tags
-- ============================================================

-- ========================================
-- 1. Admin User
-- ========================================
INSERT INTO users (email, name, initials, role, password_hash)
VALUES (
    'admin@msfg.us',
    'Admin User',
    'AU',
    'admin',
    '$2a$10$dummyhashwillbesetlater000000000000000000000000'
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    initials = VALUES(initials),
    role = VALUES(role);

-- ========================================
-- 2. Admin User Preferences
-- ========================================
INSERT INTO user_preferences (user_id, theme, default_goal_period)
SELECT id, 'light', 'monthly'
FROM users
WHERE email = 'admin@msfg.us'
ON DUPLICATE KEY UPDATE
    theme = VALUES(theme),
    default_goal_period = VALUES(default_goal_period);

-- ========================================
-- 3. Default Chat Tags
-- ========================================
INSERT INTO chat_tags (name, color) VALUES ('General', '#6b7280')
ON DUPLICATE KEY UPDATE color = VALUES(color);

INSERT INTO chat_tags (name, color) VALUES ('Important', '#ef4444')
ON DUPLICATE KEY UPDATE color = VALUES(color);

INSERT INTO chat_tags (name, color) VALUES ('Question', '#3b82f6')
ON DUPLICATE KEY UPDATE color = VALUES(color);

INSERT INTO chat_tags (name, color) VALUES ('Update', '#10b981')
ON DUPLICATE KEY UPDATE color = VALUES(color);
