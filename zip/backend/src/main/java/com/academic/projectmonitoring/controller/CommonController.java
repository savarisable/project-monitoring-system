package com.academic.projectmonitoring.controller;

import com.academic.projectmonitoring.dto.response.ApiResponse;
import com.academic.projectmonitoring.dto.response.NotificationDto;
import com.academic.projectmonitoring.entity.AcademicYear;
import com.academic.projectmonitoring.entity.FeedbackTemplate;
import com.academic.projectmonitoring.entity.SubmissionVersion;
import com.academic.projectmonitoring.exception.ResourceNotFoundException;
import com.academic.projectmonitoring.repository.AcademicYearRepository;
import com.academic.projectmonitoring.repository.FeedbackTemplateRepository;
import com.academic.projectmonitoring.repository.SubmissionVersionRepository;
import com.academic.projectmonitoring.security.UserPrincipal;
import com.academic.projectmonitoring.service.FileStorageService;
import com.academic.projectmonitoring.service.NotificationService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommonController {

    private final FeedbackTemplateRepository feedbackTemplateRepository;
    private final AcademicYearRepository academicYearRepository;
    private final NotificationService notificationService;
    private final SubmissionVersionRepository submissionVersionRepository;
    private final FileStorageService fileStorageService;

    public CommonController(FeedbackTemplateRepository feedbackTemplateRepository,
                            AcademicYearRepository academicYearRepository,
                            NotificationService notificationService,
                            SubmissionVersionRepository submissionVersionRepository,
                            FileStorageService fileStorageService) {
        this.feedbackTemplateRepository = feedbackTemplateRepository;
        this.academicYearRepository = academicYearRepository;
        this.notificationService = notificationService;
        this.submissionVersionRepository = submissionVersionRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/api/common/feedback-templates")
    public ResponseEntity<ApiResponse<List<FeedbackTemplate>>> getFeedbackTemplates() {
        List<FeedbackTemplate> templates = feedbackTemplateRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Feedback templates retrieved", templates));
    }

    @GetMapping("/api/common/academic-years")
    public ResponseEntity<ApiResponse<List<AcademicYear>>> getAcademicYears() {
        List<AcademicYear> years = academicYearRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Academic years retrieved", years));
    }

    @GetMapping("/api/common/notifications")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<NotificationDto> notifications = notificationService.getUserNotifications(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notifications));
    }

    @GetMapping("/api/common/notifications/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        long count = notificationService.getUnreadCount(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Unread count", count));
    }

    @PatchMapping("/api/common/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id,
                                                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
        notificationService.markAsRead(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Marked as read"));
    }

    @PatchMapping("/api/common/notifications/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        notificationService.markAllAsRead(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    @GetMapping("/api/files/download/{versionId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long versionId) {
        SubmissionVersion version = submissionVersionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission version not found with ID: " + versionId));

        if (version.getFilePath() == null) {
            throw new ResourceNotFoundException("No file attached to this submission version (Physical / Offline record).");
        }

        Resource resource = fileStorageService.loadFileAsResource(version.getFilePath());

        String contentType = "application/octet-stream";
        if (version.getFileName() != null && version.getFileName().toLowerCase().endsWith(".pdf")) {
            contentType = "application/pdf";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + version.getFileName() + "\"")
                .body(resource);
    }
}
