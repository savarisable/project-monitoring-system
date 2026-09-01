package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByAcademicYearIdOrderByMilestoneOrderAsc(Long academicYearId);
    List<Milestone> findByAcademicYearIdAndActiveTrueOrderByMilestoneOrderAsc(Long academicYearId);
}
