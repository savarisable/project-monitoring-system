package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.StudentRequest;
import com.academic.projectmonitoring.entity.enums.StudentRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRequestRepository extends JpaRepository<StudentRequest, Long> {
    List<StudentRequest> findByGuideIdOrderByCreatedAtDesc(Long guideId);
    List<StudentRequest> findByGuide_UserIdOrderByCreatedAtDesc(Long userId);
    List<StudentRequest> findByGroupIdOrderByCreatedAtDesc(Long groupId);
    List<StudentRequest> findByStudent_UserIdOrderByCreatedAtDesc(Long userId);
    List<StudentRequest> findByGuide_UserIdAndStatus(Long userId, StudentRequestStatus status);
}
