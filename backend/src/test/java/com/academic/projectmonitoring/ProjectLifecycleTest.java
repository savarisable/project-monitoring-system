package com.academic.projectmonitoring;

import com.academic.projectmonitoring.dto.request.ReviewSubmissionRequest;
import com.academic.projectmonitoring.dto.response.DashboardStatsDto;
import com.academic.projectmonitoring.dto.response.GroupDto;
import com.academic.projectmonitoring.dto.response.ProjectDto;
import com.academic.projectmonitoring.dto.response.SubmissionDto;
import com.academic.projectmonitoring.entity.Project;
import com.academic.projectmonitoring.entity.User;
import com.academic.projectmonitoring.entity.enums.ProjectStatus;
import com.academic.projectmonitoring.entity.enums.SubmissionStatus;
import com.academic.projectmonitoring.repository.ProjectRepository;
import com.academic.projectmonitoring.repository.UserRepository;
import com.academic.projectmonitoring.service.GuideService;
import com.academic.projectmonitoring.service.ProjectHeadService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
@Transactional
public class ProjectLifecycleTest {

    @Autowired
    private ProjectHeadService projectHeadService;

    @Autowired
    private GuideService guideService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testProjectHeadDashboardStats() {
        DashboardStatsDto stats = projectHeadService.getDashboardStats(null);
        Assertions.assertNotNull(stats);
        Assertions.assertTrue(stats.getTotalProjects() >= 2);
        Assertions.assertTrue(stats.getTotalGuides() >= 3);
        Assertions.assertTrue(stats.getTotalStudents() >= 4);
    }

    @Test
    public void testGuideAssignedGroups() {
        User guideUser = userRepository.findByUsername("guide01").orElseThrow();
        List<GroupDto> groups = guideService.getMyAssignedGroups(guideUser.getId());
        Assertions.assertFalse(groups.isEmpty());
        Assertions.assertEquals("Group 01", groups.get(0).getGroupNumber());
    }

    @Test
    public void testGuideSubmissionReviewLifecycle() {
        User guideUser = userRepository.findByUsername("guide01").orElseThrow();
        List<SubmissionDto> subs = guideService.getGuideSubmissions(guideUser.getId());
        Assertions.assertFalse(subs.isEmpty());

        SubmissionDto synopsisSub = subs.get(0);
        Assertions.assertNotNull(synopsisSub.getVersions());
        Assertions.assertFalse(synopsisSub.getVersions().isEmpty());

        Long versionId = synopsisSub.getVersions().get(0).getId();

        // Review submission
        ReviewSubmissionRequest reviewReq = new ReviewSubmissionRequest();
        reviewReq.setSubmissionVersionId(versionId);
        reviewReq.setVerdict("VERIFIED");
        reviewReq.setCustomRemarks("Approved for development");

        SubmissionDto reviewed = guideService.reviewSubmission(reviewReq, guideUser.getId(), guideUser.getUsername());
        Assertions.assertEquals(SubmissionStatus.VERIFIED, reviewed.getStatus());
    }
}
