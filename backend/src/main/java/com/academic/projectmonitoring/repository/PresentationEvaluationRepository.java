package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.PresentationEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresentationEvaluationRepository extends JpaRepository<PresentationEvaluation, Long> {
    Optional<PresentationEvaluation> findByPresentationId(Long presentationId);
    List<PresentationEvaluation> findByGuideId(Long guideId);
}
