package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByGuideIdOrderByMeetingDateDesc(Long guideId);
    List<Meeting> findByGuide_UserIdOrderByMeetingDateDesc(Long userId);
    List<Meeting> findByGroupIdOrderByMeetingDateDesc(Long groupId);
}
