package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    Optional<GroupMember> findByStudentId(Long studentId);
    List<GroupMember> findByGroupId(Long groupId);
}
