package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySubmissionIdOrderByReviewedAtDesc(Long submissionId);
    List<Review> findByGuideId(Long guideId);
}
