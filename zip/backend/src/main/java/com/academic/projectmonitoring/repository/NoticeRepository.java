package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.Notice;
import com.academic.projectmonitoring.entity.enums.NoticeTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByActiveTrueOrderByCreatedAtDesc();
    
    @Query("SELECT n FROM Notice n WHERE n.active = true AND n.toDate >= :currentDate ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notice> findActiveNotices(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT n FROM Notice n WHERE n.active = true AND n.toDate >= :currentDate AND " +
           "(n.targetRole = com.academic.projectmonitoring.entity.enums.NoticeTarget.ALL OR " +
           " n.targetRole = :role OR " +
           " (n.targetRole = com.academic.projectmonitoring.entity.enums.NoticeTarget.SPECIFIC_GROUP AND n.targetGroup.id = :groupId)) " +
           "ORDER BY n.createdAt DESC")
    List<Notice> findActiveNoticesForStudent(@Param("currentDate") LocalDate currentDate, 
                                            @Param("role") NoticeTarget role, 
                                            @Param("groupId") Long groupId);

    @Query("SELECT n FROM Notice n WHERE n.active = true AND n.toDate >= :currentDate AND " +
           "(n.targetRole = com.academic.projectmonitoring.entity.enums.NoticeTarget.ALL OR " +
           " n.targetRole = com.academic.projectmonitoring.entity.enums.NoticeTarget.ROLE_GUIDE OR " +
           " n.createdBy.id = :userId) " +
           "ORDER BY n.createdAt DESC")
    List<Notice> findActiveNoticesForGuide(@Param("currentDate") LocalDate currentDate, @Param("userId") Long userId);
}
