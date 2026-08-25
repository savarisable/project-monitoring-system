package com.academic.projectmonitoring.repository;

import com.academic.projectmonitoring.entity.Guide;
import com.academic.projectmonitoring.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuideRepository extends JpaRepository<Guide, Long> {
    Optional<Guide> findByUser(User user);
    Optional<Guide> findByUserId(Long userId);
}
