package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.SubmissionVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionVersionRepository extends JpaRepository<SubmissionVersion, Long> {
    List<SubmissionVersion> findBySubmissionIdOrderByVersionNumberDesc(Long submissionId);
}
