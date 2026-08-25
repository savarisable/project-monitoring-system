-- =============================================================================
-- PROJECT MONITORING SYSTEM - FULL DATABASE SCHEMA & REAL SEED DATA (38 GROUPS)
-- Database: MySQL 8.x
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `project_monitoring_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `project_monitoring_db`;

-- Drop existing tables in reverse dependency order
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `student_requests`;
DROP TABLE IF EXISTS `meetings`;
DROP TABLE IF EXISTS `in_app_notifications`;
DROP TABLE IF EXISTS `notices`;
DROP TABLE IF EXISTS `presentation_evaluations`;
DROP TABLE IF EXISTS `presentations`;
DROP TABLE IF EXISTS `feedback_templates`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `submission_versions`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `project_milestones`;
DROP TABLE IF EXISTS `milestones`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `guide_allocations`;
DROP TABLE IF EXISTS `group_members`;
DROP TABLE IF EXISTS `project_groups`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `guides`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `academic_years`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Academic Years
CREATE TABLE `academic_years` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `year_name` VARCHAR(20) NOT NULL UNIQUE,
    `is_current` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Roles
CREATE TABLE `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Users
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) UNIQUE,
    `phone` VARCHAR(20),
    `role_id` BIGINT NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Guides
CREATE TABLE `guides` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `department` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(100) NOT NULL,
    `specialization` VARCHAR(255),
    `max_groups_capacity` INT DEFAULT 8,
    CONSTRAINT `fk_guides_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Students
CREATE TABLE `students` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `roll_number` VARCHAR(50) NOT NULL UNIQUE,
    `department` VARCHAR(100) NOT NULL,
    `semester` INT NOT NULL DEFAULT 7,
    `academic_year_id` BIGINT NOT NULL,
    CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_students_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Project Groups
CREATE TABLE `project_groups` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `group_number` VARCHAR(50) NOT NULL,
    `academic_year_id` BIGINT NOT NULL,
    `status` VARCHAR(30) DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_groups_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Group Members
CREATE TABLE `group_members` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `group_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL UNIQUE,
    `is_leader` BOOLEAN DEFAULT FALSE,
    `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_members_group` FOREIGN KEY (`group_id`) REFERENCES `project_groups` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_members_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Guide Allocations
CREATE TABLE `guide_allocations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `group_id` BIGINT NOT NULL,
    `guide_id` BIGINT NOT NULL,
    `allocated_by_user_id` BIGINT NOT NULL,
    `allocated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    CONSTRAINT `fk_allocations_group` FOREIGN KEY (`group_id`) REFERENCES `project_groups` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_allocations_guide` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`),
    CONSTRAINT `fk_allocations_by` FOREIGN KEY (`allocated_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Projects
CREATE TABLE `projects` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `group_id` BIGINT NOT NULL UNIQUE,
    `academic_year_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `domain` VARCHAR(100),
    `technologies` VARCHAR(255),
    `status` VARCHAR(50) DEFAULT 'ON_TRACK',
    `progress_percentage` INT DEFAULT 0,
    `start_date` DATE,
    `expected_end_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_projects_group` FOREIGN KEY (`group_id`) REFERENCES `project_groups` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_projects_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Milestones (Template Stages)
CREATE TABLE `milestones` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `academic_year_id` BIGINT NOT NULL,
    `milestone_order` INT NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `default_deadline_days` INT DEFAULT 14,
    `is_required` BOOLEAN DEFAULT TRUE,
    CONSTRAINT `fk_milestones_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Project Milestones
CREATE TABLE `project_milestones` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `project_id` BIGINT NOT NULL,
    `milestone_id` BIGINT NOT NULL,
    `status` VARCHAR(50) DEFAULT 'PENDING',
    `deadline` DATE,
    `completed_at` TIMESTAMP NULL,
    CONSTRAINT `fk_pm_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pm_milestone` FOREIGN KEY (`milestone_id`) REFERENCES `milestones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Submissions
CREATE TABLE `submissions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `project_milestone_id` BIGINT NOT NULL UNIQUE,
    `project_id` BIGINT NOT NULL,
    `group_id` BIGINT NOT NULL,
    `submission_type` VARCHAR(50) NOT NULL,
    `current_version` INT DEFAULT 1,
    `status` VARCHAR(50) DEFAULT 'ONLINE_SUBMITTED',
    `last_submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sub_pm` FOREIGN KEY (`project_milestone_id`) REFERENCES `project_milestones` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sub_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
    CONSTRAINT `fk_sub_group` FOREIGN KEY (`group_id`) REFERENCES `project_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Submission Versions
CREATE TABLE `submission_versions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `submission_id` BIGINT NOT NULL,
    `version_number` INT NOT NULL,
    `submission_mode` VARCHAR(20) DEFAULT 'ONLINE',
    `file_path` VARCHAR(500),
    `file_name` VARCHAR(255),
    `file_size` BIGINT,
    `student_notes` TEXT,
    `submitted_by_user_id` BIGINT NOT NULL,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_version_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_version_user` FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Feedback Templates
CREATE TABLE `feedback_templates` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `title` VARCHAR(100) NOT NULL,
    `message_template` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Reviews
CREATE TABLE `reviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `submission_version_id` BIGINT NOT NULL UNIQUE,
    `submission_id` BIGINT NOT NULL,
    `guide_id` BIGINT NOT NULL,
    `verdict` VARCHAR(50) NOT NULL,
    `predefined_feedback_id` BIGINT,
    `predefined_feedback_text` TEXT,
    `custom_remarks` TEXT,
    `reviewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reviews_version` FOREIGN KEY (`submission_version_id`) REFERENCES `submission_versions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reviews_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`),
    CONSTRAINT `fk_reviews_guide` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`),
    CONSTRAINT `fk_reviews_template` FOREIGN KEY (`predefined_feedback_id`) REFERENCES `feedback_templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Presentations
CREATE TABLE `presentations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `academic_year_id` BIGINT NOT NULL,
    `project_id` BIGINT NOT NULL,
    `presentation_number` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `scheduled_date` DATE NOT NULL,
    `start_time` TIME,
    `end_time` TIME,
    `venue` VARCHAR(100),
    `description` TEXT,
    `status` VARCHAR(50) DEFAULT 'SCHEDULED',
    CONSTRAINT `fk_pres_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
    CONSTRAINT `fk_pres_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Presentation Evaluations
CREATE TABLE `presentation_evaluations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `presentation_id` BIGINT NOT NULL UNIQUE,
    `guide_id` BIGINT NOT NULL,
    `marks_obtained` DECIMAL(5,2) NOT NULL,
    `max_marks` DECIMAL(5,2) DEFAULT 50.00,
    `remarks` TEXT,
    `attendance_status` VARCHAR(50) DEFAULT 'PRESENT',
    `evaluated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pe_pres` FOREIGN KEY (`presentation_id`) REFERENCES `presentations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pe_guide` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. Notices
CREATE TABLE `notices` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `priority` VARCHAR(20) DEFAULT 'HIGH',
    `target` VARCHAR(50) DEFAULT 'ALL',
    `target_group_id` BIGINT NULL,
    `from_date` DATE NOT NULL,
    `to_date` DATE NOT NULL,
    `published_by_user_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notices_group` FOREIGN KEY (`target_group_id`) REFERENCES `project_groups` (`id`),
    CONSTRAINT `fk_notices_user` FOREIGN KEY (`published_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. In-App Notifications
CREATE TABLE `in_app_notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `category` VARCHAR(50) DEFAULT 'SYSTEM',
    `reference_id` BIGINT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. Meetings
CREATE TABLE `meetings` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `guide_id` BIGINT NOT NULL,
    `group_id` BIGINT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `meeting_date` DATE NOT NULL,
    `meeting_time` VARCHAR(50) NOT NULL,
    `venue` VARCHAR(100) NOT NULL,
    `purpose` TEXT,
    `status` VARCHAR(50) DEFAULT 'SCHEDULED',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_meetings_guide` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`),
    CONSTRAINT `fk_meetings_group` FOREIGN KEY (`group_id`) REFERENCES `project_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21. Student Requests
CREATE TABLE `student_requests` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `group_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL,
    `guide_id` BIGINT NOT NULL,
    `predefined_question` VARCHAR(100) NOT NULL,
    `additional_note` TEXT,
    `status` VARCHAR(50) DEFAULT 'OPEN',
    `guide_response` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `responded_at` TIMESTAMP NULL,
    CONSTRAINT `fk_req_group` FOREIGN KEY (`group_id`) REFERENCES `project_groups` (`id`),
    CONSTRAINT `fk_req_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
    CONSTRAINT `fk_req_guide` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 22. Audit Logs
CREATE TABLE `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT,
    `username` VARCHAR(50) NOT NULL,
    `user_role` VARCHAR(50),
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) NOT NULL,
    `entity_id` BIGINT,
    `details` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data initialized automatically by Spring Boot DataInitializerService.
