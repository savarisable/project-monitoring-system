package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.ProjectDiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectDiaryEntryRepository extends JpaRepository<ProjectDiaryEntry, Long> {
    List<ProjectDiaryEntry> findByGroupIdOrderByMeetingDateDesc(Long groupId);
    List<ProjectDiaryEntry> findByGuideIdOrderByMeetingDateDesc(Long guideId);
    List<ProjectDiaryEntry> findByProjectIdOrderByMeetingDateDesc(Long projectId);

    @Query("SELECT d FROM ProjectDiaryEntry d JOIN d.group g JOIN g.academicYear y WHERE y.id = :yearId ORDER BY d.meetingDate DESC")
    List<ProjectDiaryEntry> findByAcademicYearIdOrderByMeetingDateDesc(@Param("yearId") Long yearId);
}
