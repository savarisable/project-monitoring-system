package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.ProjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectGroupRepository extends JpaRepository<ProjectGroup, Long> {
    Optional<ProjectGroup> findByGroupNumberAndAcademicYearId(String groupNumber, Long academicYearId);
    List<ProjectGroup> findByAcademicYearId(Long academicYearId);
}
