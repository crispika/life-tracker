USE life_tracker;

-- 插入初始用户
-- 密码为 'password123' 的哈希值 (使用bcrypt算法)
INSERT INTO USER (email, password_hash, display_name, is_active, created_at, updated_at)
VALUES 
('demo@example.com', '$2a$10$6KlPzFGf9Y8zVHHh8jMzVeH/S.dOLAYNm8xRYVCr/inxbZRXUUYbO', '示例用户', TRUE, NOW(), NOW());