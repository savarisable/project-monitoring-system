package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.Presentation;
import com.academic.projectmonitoring.entity.enums.PresentationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresentationRepository extends JpaRepository<Presentation, Long> {
    List<Presentation> findByProjectIdOrderByPresentationNumberAsc(Long projectId);
    List<Presentation> findByAcademicYearId(Long academicYearId);
    List<Presentation> findByStatus(PresentationStatus status);
    
    @Query("SELECT p FROM Presentation p JOIN p.project pr JOIN pr.group g JOIN g.guideAllocation ga " +
           "WHERE ga.guide.id = :guideId AND ga.active = true ORDER BY p.scheduledDate ASC")
    List<Presentation> findByGuideId(@Param("guideId") Long guideId);

    @Query("SELECT p FROM Presentation p JOIN p.project pr JOIN pr.group g JOIN g.guideAllocation ga " +
           "WHERE ga.guide.user.id = :userId AND ga.active = true ORDER BY p.scheduledDate ASC")
    List<Presentation> findByGuideUserId(@Param("userId") Long userId);
}
