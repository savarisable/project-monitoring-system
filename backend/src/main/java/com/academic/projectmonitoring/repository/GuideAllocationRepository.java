package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.GuideAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideAllocationRepository extends JpaRepository<GuideAllocation, Long> {
    Optional<GuideAllocation> findByGroupIdAndActiveTrue(Long groupId);
    Optional<GuideAllocation> findByGroupId(Long groupId);
    List<GuideAllocation> findAllByGroupId(Long groupId);
    List<GuideAllocation> findByGuideIdAndActiveTrue(Long guideId);
    List<GuideAllocation> findByGuide_UserIdAndActiveTrue(Long userId);
    long countByGuideIdAndActiveTrue(Long guideId);
}
