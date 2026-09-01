package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.DiaryAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaryAttendanceRepository extends JpaRepository<DiaryAttendance, Long> {
    List<DiaryAttendance> findByDiaryEntryId(Long diaryEntryId);
    List<DiaryAttendance> findByStudentId(Long studentId);
}
