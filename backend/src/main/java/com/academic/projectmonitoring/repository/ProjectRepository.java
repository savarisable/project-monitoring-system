package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.Project;
import com.academic.projectmonitoring.entity.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByGroupId(Long groupId);
    List<Project> findByAcademicYearId(Long academicYearId);
    List<Project> findByStatus(ProjectStatus status);
    
    @Query("SELECT p FROM Project p JOIN p.group g JOIN g.guideAllocation ga WHERE ga.guide.id = :guideId AND ga.active = true")
    List<Project> findByGuideId(@Param("guideId") Long guideId);

    @Query("SELECT p FROM Project p JOIN p.group g JOIN g.guideAllocation ga WHERE ga.guide.user.id = :userId AND ga.active = true")
    List<Project> findByGuideUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Project p JOIN p.group g JOIN g.members gm WHERE gm.student.user.id = :userId")
    Optional<Project> findByStudentUserId(@Param("userId") Long userId);

    long countByAcademicYearId(Long academicYearId);
    long countByAcademicYearIdAndStatus(Long academicYearId, ProjectStatus status);
}
