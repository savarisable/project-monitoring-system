package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.StudentWorkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentWorkLogRepository extends JpaRepository<StudentWorkLog, Long> {
    List<StudentWorkLog> findByStudentIdOrderByLogDateDesc(Long studentId);
    List<StudentWorkLog> findByGroupIdOrderByLogDateDesc(Long groupId);
    List<StudentWorkLog> findByProjectIdOrderByLogDateDesc(Long projectId);
}
