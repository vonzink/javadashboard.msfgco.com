-- ============================================================
-- MSFG Dashboard - Flyway V1: Initial Schema
-- All tables for the Java/Spring Boot dashboard application
-- MySQL 8.0 compatible
-- ============================================================

-- ========================================
-- 1. USERS
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(10),
    role VARCHAR(100) DEFAULT 'user',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 2. REFRESH TOKENS (JWT refresh token storage)
-- ========================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token(255)),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 3. API KEYS
-- ========================================
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    key_name VARCHAR(100),
    api_key VARCHAR(255) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME NULL,
    last_used_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_active (active),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 4. WEBHOOK LOGS
-- ========================================
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_key_id INT NULL,
    endpoint VARCHAR(255),
    method VARCHAR(20),
    payload JSON NULL,
    response_code INT NULL,
    response_body JSON NULL,
    ip_address VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE SET NULL,
    INDEX idx_api_key (api_key_id),
    INDEX idx_endpoint (endpoint),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 5. INVESTORS
-- ========================================
CREATE TABLE IF NOT EXISTS investors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investor_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    login_url TEXT,
    account_executive_name VARCHAR(255),
    account_executive_mobile VARCHAR(50),
    account_executive_email VARCHAR(255),
    account_executive_address TEXT,
    notes TEXT,
    states TEXT,
    best_programs TEXT,
    minimum_fico VARCHAR(64),
    in_house_dpa VARCHAR(64),
    epo VARCHAR(128),
    max_comp DECIMAL(10,2) DEFAULT NULL,
    doc_review_wire VARCHAR(64),
    remote_closing_review VARCHAR(64),
    website_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (investor_key),
    INDEX idx_active (is_active),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 6. INVESTOR TEAM
-- ========================================
CREATE TABLE IF NOT EXISTS investor_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investor_id INT NOT NULL,
    role VARCHAR(255),
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
    INDEX idx_investor (investor_id),
    INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 7. INVESTOR LENDER IDS
-- ========================================
CREATE TABLE IF NOT EXISTS investor_lender_ids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investor_id INT NOT NULL,
    fha_id VARCHAR(100),
    va_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
    INDEX idx_investor (investor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 8. INVESTOR MORTGAGEE CLAUSES
-- ========================================
CREATE TABLE IF NOT EXISTS investor_mortgagee_clauses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investor_id INT NOT NULL,
    name VARCHAR(255),
    isaoa VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
    INDEX idx_investor (investor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 9. INVESTOR LINKS
-- ========================================
CREATE TABLE IF NOT EXISTS investor_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investor_id INT NOT NULL,
    link_type VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    label VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
    INDEX idx_investor (investor_id),
    INDEX idx_type (link_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 10. INVESTOR NOTES (composite PK)
-- ========================================
CREATE TABLE IF NOT EXISTS investor_notes (
    investor_id INT NOT NULL,
    user_id INT NOT NULL,
    notes TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (investor_id, user_id),
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_investor (investor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 11. ANNOUNCEMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    link TEXT,
    icon VARCHAR(100),
    author_id INT,
    file_s3_key VARCHAR(500),
    file_name VARCHAR(255),
    file_size INT,
    file_type VARCHAR(100),
    status ENUM('active', 'archived') NOT NULL DEFAULT 'active',
    archived_at TIMESTAMP NULL DEFAULT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_created (created_at),
    INDEX idx_author (author_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 12. NOTIFICATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reminder_date DATE NOT NULL,
    reminder_time TIME NOT NULL,
    note TEXT NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, reminder_date, reminder_time),
    INDEX idx_sent (sent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 13. GOALS
-- ========================================
CREATE TABLE IF NOT EXISTS goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category ENUM('units', 'total_amount', 'activities') NOT NULL,
    period_type ENUM('monthly', 'ytd') NULL,
    period_value VARCHAR(20) NULL,
    title VARCHAR(500) NULL,
    due_date DATE NULL,
    notes TEXT NULL,
    target_value DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) DEFAULT 0,
    created_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_calculated_goal (user_id, category, period_type, period_value),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_category (category),
    INDEX idx_period (period_type, period_value),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 14. USER PREFERENCES
-- ========================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    theme VARCHAR(20) DEFAULT 'light',
    default_goal_period VARCHAR(20) DEFAULT 'monthly',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 15. CALENDAR EVENTS
-- ========================================
CREATE TABLE IF NOT EXISTS calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    who VARCHAR(255),
    start DATETIME NOT NULL,
    end DATETIME,
    allDay TINYINT DEFAULT 0,
    notes TEXT,
    color VARCHAR(20) DEFAULT '#104547',
    recurrence_rule VARCHAR(20) DEFAULT 'none',
    recurrence_end DATE NULL,
    recurrence_group_id VARCHAR(36) NULL,
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_start (start),
    INDEX idx_created_by (created_by),
    INDEX idx_recurrence_group (recurrence_group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 16. PIPELINE
-- ========================================
CREATE TABLE IF NOT EXISTS pipeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_number VARCHAR(100),
    client_name VARCHAR(255) NOT NULL,
    loan_amount DECIMAL(15,2),
    loan_type VARCHAR(100),
    stage VARCHAR(100),
    target_close_date DATE,
    assigned_lo_id INT,
    assigned_lo_name VARCHAR(255),
    investor VARCHAR(255),
    investor_id INT NULL,
    status VARCHAR(100),
    notes TEXT,
    loan_status VARCHAR(150),
    lender VARCHAR(255),
    subject_property VARCHAR(500),
    rate VARCHAR(50),
    appraisal_status VARCHAR(150),
    loan_purpose VARCHAR(150),
    occupancy VARCHAR(150),
    title_status VARCHAR(150),
    hoi_status VARCHAR(150),
    loan_estimate VARCHAR(150),
    application_date DATE,
    lock_expiration_date DATE,
    closing_date DATE,
    funding_date DATE,
    prelims_status VARCHAR(150),
    mini_set_status VARCHAR(150),
    cd_status VARCHAR(150),
    monday_item_id BIGINT NULL,
    monday_board_id BIGINT NULL,
    source VARCHAR(50) DEFAULT 'manual',
    external_loan_id VARCHAR(255) NULL,
    source_system VARCHAR(100) NULL,
    last_synced_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_lo_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE SET NULL,
    INDEX idx_lo (assigned_lo_id),
    INDEX idx_investor (investor_id),
    INDEX idx_status (status),
    INDEX idx_stage (stage),
    INDEX idx_close_date (target_close_date),
    UNIQUE INDEX idx_monday_item_id (monday_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 17. FUNDED LOANS
-- ========================================
CREATE TABLE IF NOT EXISTS funded_loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_number VARCHAR(100),
    borrower_name VARCHAR(255) NOT NULL,
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_type VARCHAR(100),
    investor VARCHAR(255),
    investor_id INT NULL,
    funding_date DATE NOT NULL,
    lo_id INT,
    lo_name VARCHAR(255),
    processor_name VARCHAR(255),
    assigned_processor_id INT,
    property_address VARCHAR(500),
    notes TEXT,
    original_pipeline_id INT,
    source VARCHAR(50) DEFAULT 'manual',
    source_system VARCHAR(100),
    external_loan_id VARCHAR(255),
    monday_item_id BIGINT NULL,
    monday_board_id BIGINT NULL,
    source_board_id VARCHAR(50) NULL,
    last_synced_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lo_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_processor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE SET NULL,
    INDEX idx_funded_date (funding_date),
    INDEX idx_lo (lo_id),
    INDEX idx_processor (assigned_processor_id),
    INDEX idx_external (external_loan_id),
    UNIQUE INDEX idx_fl_monday_item_id (monday_item_id),
    INDEX idx_fl_source_board (source_board_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 18. PROCESSOR-LO ASSIGNMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS processor_lo_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    processor_id INT NOT NULL,
    lo_id INT NOT NULL,
    assigned_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_assignment (processor_id, lo_id),
    FOREIGN KEY (processor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lo_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_processor (processor_id),
    INDEX idx_lo (lo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 19. PRE-APPROVALS
-- ========================================
CREATE TABLE IF NOT EXISTS pre_approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    loan_amount DECIMAL(15,2),
    pre_approval_date DATE,
    expiration_date DATE,
    status ENUM('active', 'expired', 'converted', 'cancelled') DEFAULT 'active',
    assigned_lo_id INT,
    assigned_lo_name VARCHAR(255),
    property_address VARCHAR(500),
    loan_type VARCHAR(100),
    notes TEXT,
    source VARCHAR(50) DEFAULT 'manual',
    source_system VARCHAR(50) DEFAULT 'manual',
    monday_item_id BIGINT NULL,
    monday_board_id BIGINT NULL,
    source_board_id VARCHAR(50) NULL,
    group_name VARCHAR(255) NULL,
    last_synced_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_lo_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_lo (assigned_lo_id),
    INDEX idx_status (status),
    INDEX idx_expiration (expiration_date),
    UNIQUE INDEX idx_pa_monday_item_id (monday_item_id),
    INDEX idx_pa_source_board (source_board_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 20. TASKS
-- ========================================
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATE,
    assigned_to INT,
    assigned_by INT,
    source VARCHAR(50) DEFAULT 'manual',
    webhook_id VARCHAR(255),
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 21. USER INTEGRATIONS (encrypted credentials)
-- ========================================
CREATE TABLE IF NOT EXISTS user_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service VARCHAR(50) NOT NULL,
    credential_type VARCHAR(30) NOT NULL,
    encrypted_value TEXT NOT NULL,
    iv VARCHAR(64) NOT NULL,
    auth_tag VARCHAR(64) NOT NULL,
    label VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_tested_at DATETIME NULL,
    last_test_result VARCHAR(10) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_service (user_id, service, credential_type),
    INDEX idx_user (user_id),
    INDEX idx_service (service)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 22. PROMPT TEMPLATES
-- ========================================
CREATE TABLE IF NOT EXISTS prompt_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    platform VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    tone VARCHAR(100),
    audience VARCHAR(255),
    rules TEXT,
    example_post TEXT,
    model VARCHAR(50) DEFAULT 'gpt-4o-mini',
    temperature DECIMAL(2,1) DEFAULT 0.8,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_platform (user_id, platform),
    INDEX idx_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 23. CONTENT ITEMS
-- ========================================
CREATE TABLE IF NOT EXISTS content_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    keyword VARCHAR(500) NOT NULL,
    suggestion VARCHAR(500) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    prompt_template_id INT NULL,
    status VARCHAR(30) DEFAULT 'draft',
    text_content TEXT NOT NULL,
    hashtags JSON,
    image_s3_key VARCHAR(500) NULL,
    image_source VARCHAR(30) NULL,
    video_s3_key VARCHAR(500) NULL,
    video_source VARCHAR(30) NULL,
    scheduled_at DATETIME NULL,
    posted_at DATETIME NULL,
    post_external_id VARCHAR(255) NULL,
    approved_by INT NULL,
    approved_at DATETIME NULL,
    review_notes TEXT NULL,
    automation_method VARCHAR(20) NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (prompt_template_id) REFERENCES prompt_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_status (user_id, status),
    INDEX idx_platform (platform),
    INDEX idx_scheduled (scheduled_at),
    INDEX idx_keyword (keyword(100)),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 24. CONTENT AUDIT LOG
-- ========================================
CREATE TABLE IF NOT EXISTS content_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(30) NOT NULL,
    details JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_content (content_id),
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 25. KEYWORD CACHE
-- ========================================
CREATE TABLE IF NOT EXISTS keyword_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(500) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    country VARCHAR(10) DEFAULT 'US',
    results JSON NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_keyword_locale (keyword(200), language, country),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 26. CHAT TAGS
-- ========================================
CREATE TABLE IF NOT EXISTS chat_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#6b7280',
    created_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 27. CHAT MESSAGES
-- ========================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_initials VARCHAR(10),
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created (created_at),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 28. CHAT MESSAGE TAGS (join table)
-- ========================================
CREATE TABLE IF NOT EXISTS chat_message_tags (
    message_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (message_id, tag_id),
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES chat_tags(id) ON DELETE CASCADE,
    INDEX idx_tag (tag_id),
    INDEX idx_message (message_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 29. MONDAY BOARDS
-- ========================================
CREATE TABLE IF NOT EXISTS monday_boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id VARCHAR(50) NOT NULL UNIQUE,
    board_name VARCHAR(255) NOT NULL DEFAULT '',
    target_section ENUM('pipeline', 'pre_approvals', 'funded_loans') NOT NULL DEFAULT 'pipeline',
    is_active TINYINT(1) DEFAULT 1,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 30. MONDAY BOARD ACCESS
-- ========================================
CREATE TABLE IF NOT EXISTS monday_board_access (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_board_user (board_id, user_id),
    INDEX idx_user (user_id),
    INDEX idx_board (board_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 31. MONDAY COLUMN MAPPINGS
-- ========================================
CREATE TABLE IF NOT EXISTS monday_column_mappings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id VARCHAR(50) NOT NULL,
    monday_column_id VARCHAR(100) NOT NULL,
    monday_column_title VARCHAR(255) NULL,
    pipeline_field VARCHAR(100) NOT NULL,
    display_label VARCHAR(255) NULL,
    display_order INT DEFAULT 99,
    visible TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_board_monday_col (board_id, monday_column_id),
    UNIQUE KEY uk_board_pipeline_field (board_id, pipeline_field)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 32. MONDAY SYNC LOG
-- ========================================
CREATE TABLE IF NOT EXISTS monday_sync_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id VARCHAR(50) NOT NULL,
    triggered_by INT NULL,
    items_synced INT DEFAULT 0,
    items_created INT DEFAULT 0,
    items_updated INT DEFAULT 0,
    target_section VARCHAR(50) NULL,
    status ENUM('running', 'success', 'error') DEFAULT 'running',
    error_message TEXT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP NULL,
    INDEX idx_board (board_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 33. USER PROFILES (employee directory)
-- ========================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    team VARCHAR(100) NULL,
    phone VARCHAR(50) NULL,
    display_email VARCHAR(255) NULL,
    website VARCHAR(500) NULL,
    online_app_url VARCHAR(500) NULL,
    facebook_url VARCHAR(500) NULL,
    instagram_url VARCHAR(500) NULL,
    twitter_url VARCHAR(500) NULL,
    linkedin_url VARCHAR(500) NULL,
    tiktok_url VARCHAR(500) NULL,
    avatar_s3_key VARCHAR(500) NULL,
    email_signature TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 34. EMPLOYEE NOTES
-- ========================================
CREATE TABLE IF NOT EXISTS employee_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    author_id INT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_en_user (user_id),
    INDEX idx_en_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 35. EMPLOYEE DOCUMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS employee_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_s3_key VARCHAR(500) NOT NULL,
    file_size INT NULL,
    file_type VARCHAR(100) NULL,
    category VARCHAR(100) NULL,
    description VARCHAR(500) NULL,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ed_user (user_id),
    INDEX idx_ed_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 36. GUIDELINE FILES
-- ========================================
CREATE TABLE IF NOT EXISTS guideline_files (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(500) NOT NULL,
    s3_key VARCHAR(1000) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    version_label VARCHAR(100) DEFAULT NULL,
    total_pages INT UNSIGNED DEFAULT NULL,
    total_sections INT UNSIGNED DEFAULT NULL,
    file_size BIGINT UNSIGNED DEFAULT NULL,
    status ENUM('processing', 'ready', 'error') NOT NULL DEFAULT 'processing',
    error_message TEXT DEFAULT NULL,
    uploaded_by INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_type (product_type),
    INDEX idx_status (status),
    CONSTRAINT fk_guideline_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 37. GUIDELINE CHUNKS
-- ========================================
CREATE TABLE IF NOT EXISTS guideline_chunks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_id INT UNSIGNED NOT NULL,
    section_id VARCHAR(50) DEFAULT NULL,
    section_title VARCHAR(500) DEFAULT NULL,
    page_number INT UNSIGNED DEFAULT NULL,
    chunk_index INT UNSIGNED NOT NULL DEFAULT 0,
    content LONGTEXT NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_file_id (file_id),
    INDEX idx_product_type (product_type),
    INDEX idx_section_id (section_id),
    FULLTEXT idx_ft_search (section_title, content),
    CONSTRAINT fk_chunk_file FOREIGN KEY (file_id) REFERENCES guideline_files(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 38. LENDINGPAD LOANS
-- ========================================
CREATE TABLE IF NOT EXISTS lendingpad_loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id VARCHAR(100) UNIQUE,
    company_id VARCHAR(100),
    loan_number VARCHAR(50),
    lender_loan_number VARCHAR(100),
    broker_loan_number VARCHAR(100),
    loan_amount DECIMAL(15,2),
    total_loan_amount DECIMAL(15,2),
    purchase_price DECIMAL(15,2),
    appraisal_value DECIMAL(15,2),
    note_rate DECIMAL(6,3),
    apr DECIMAL(6,3),
    term INT,
    credit_score INT,
    units INT,
    ltv_ratio DECIMAL(6,3),
    combined_ltv DECIMAL(6,3),
    hc_ltv DECIMAL(6,3),
    front_dti DECIMAL(6,3),
    back_dti DECIMAL(6,3),
    pmi DECIMAL(10,2),
    other_financing DECIMAL(15,2),
    total_liquid_assets DECIMAL(15,2),
    total_liability_balance DECIMAL(15,2),
    total_liabilities_monthly DECIMAL(15,2),
    positive_net_rental_income DECIMAL(15,2),
    negative_net_rental_income DECIMAL(15,2),
    lender VARCHAR(255),
    broker VARCHAR(255),
    campaign VARCHAR(255),
    channel_type VARCHAR(100),
    document_type VARCHAR(100),
    agency_case_number VARCHAR(100),
    escrow_waiver TINYINT(1) DEFAULT 0,
    property_legal_description TEXT,
    legal_description_abbreviation VARCHAR(255),
    underwriter_comments TEXT,
    loan_reference_id VARCHAR(255),
    monday_item_id VARCHAR(50),
    monday_board_id VARCHAR(50),
    monday_synced_at TIMESTAMP NULL,
    raw_json JSON,
    received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_loan_number (loan_number),
    INDEX idx_loan_id (loan_id),
    INDEX idx_received_at (received_at),
    INDEX idx_monday_item_id (monday_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 39. PROCESSING RECORDS
-- ========================================
CREATE TABLE IF NOT EXISTS processing_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    borrower VARCHAR(255) NOT NULL,
    loan_number VARCHAR(100),
    address VARCHAR(500),
    vendor VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ordered',
    ordered_date DATE,
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_proc_user_type (user_id, type),
    INDEX idx_proc_type_status (type, status),
    INDEX idx_proc_borrower (borrower),
    INDEX idx_proc_loan_number (loan_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 40. TAX COUNTIES
-- ========================================
CREATE TABLE IF NOT EXISTS tax_counties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    county VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    assessor_url VARCHAR(500),
    treasurer_url VARCHAR(500),
    login_required TINYINT(1) NOT NULL DEFAULT 0,
    known_costs_fees VARCHAR(500),
    online_portal TINYINT(1) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_county_state (county, state),
    INDEX idx_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 41. HANDBOOK DOCUMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS handbook_documents (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 42. HANDBOOK SECTIONS
-- ========================================
CREATE TABLE IF NOT EXISTS handbook_sections (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id INT UNSIGNED NOT NULL,
    slug VARCHAR(200) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content LONGTEXT NOT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    updated_by INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_doc_slug (document_id, slug),
    INDEX idx_document_id (document_id),
    FULLTEXT idx_ft_handbook (title, content),
    CONSTRAINT fk_handbook_doc FOREIGN KEY (document_id) REFERENCES handbook_documents(id) ON DELETE CASCADE,
    CONSTRAINT fk_handbook_editor FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 43. PROCESSING LINKS
-- ========================================
CREATE TABLE IF NOT EXISTS processing_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_type VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    fax VARCHAR(50) DEFAULT NULL,
    agent_name VARCHAR(255) DEFAULT NULL,
    agent_email VARCHAR(255) DEFAULT NULL,
    icon VARCHAR(100) DEFAULT 'fa-link',
    group_label VARCHAR(100) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_section_type (section_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
