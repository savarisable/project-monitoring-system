package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.FeedbackTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackTemplateRepository extends JpaRepository<FeedbackTemplate, Long> {
    Optional<FeedbackTemplate> findByCode(String code);
}
