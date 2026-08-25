package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.ProjectMilestone;
import com.academic.projectmonitoring.entity.enums.MilestoneStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, Long> {
    List<ProjectMilestone> findByProjectIdOrderByMilestone_MilestoneOrderAsc(Long projectId);
    Optional<ProjectMilestone> findByProjectIdAndMilestoneId(Long projectId, Long milestoneId);
    
    @Query("SELECT pm FROM ProjectMilestone pm WHERE pm.deadline < :currentDate AND pm.status NOT IN ('COMPLETED')")
    List<ProjectMilestone> findDelayedMilestones(@Param("currentDate") LocalDate currentDate);
}
