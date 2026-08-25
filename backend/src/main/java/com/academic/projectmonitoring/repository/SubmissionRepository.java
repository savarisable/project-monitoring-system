package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.Submission;
import com.academic.projectmonitoring.entity.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByProjectId(Long projectId);
    List<Submission> findByGroupId(Long groupId);
    Optional<Submission> findByProjectMilestoneId(Long projectMilestoneId);
    List<Submission> findByStatus(SubmissionStatus status);
    
    @Query("SELECT s FROM Submission s JOIN s.project p JOIN p.group g JOIN g.guideAllocation ga " +
           "WHERE ga.guide.id = :guideId AND ga.active = true")
    List<Submission> findByGuideId(@Param("guideId") Long guideId);

    @Query("SELECT s FROM Submission s JOIN s.project p JOIN p.group g JOIN g.guideAllocation ga " +
           "WHERE ga.guide.user.id = :userId AND ga.active = true AND " +
           "s.status IN (com.academic.projectmonitoring.entity.enums.SubmissionStatus.ONLINE_SUBMITTED, " +
           "             com.academic.projectmonitoring.entity.enums.SubmissionStatus.OFFLINE_SUBMITTED, " +
           "             com.academic.projectmonitoring.entity.enums.SubmissionStatus.RESUBMITTED)")
    List<Submission> findPendingSubmissionsForGuideUser(@Param("userId") Long userId);

    @Query("SELECT s FROM Submission s WHERE s.status IN (" +
           "com.academic.projectmonitoring.entity.enums.SubmissionStatus.ONLINE_SUBMITTED, " +
           "com.academic.projectmonitoring.entity.enums.SubmissionStatus.OFFLINE_SUBMITTED, " +
           "com.academic.projectmonitoring.entity.enums.SubmissionStatus.RESUBMITTED)")
    List<Submission> findAllPendingSubmissions();

    long countByStatus(SubmissionStatus status);
}
