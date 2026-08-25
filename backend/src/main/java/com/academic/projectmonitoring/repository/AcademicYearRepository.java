package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    Optional<AcademicYear> findByCurrentTrue();
    Optional<AcademicYear> findByYearName(String yearName);
}
