package com.academic.projectmonitoring.controller;

import com.academic.projectmonitoring.dto.request.*;
import com.academic.projectmonitoring.dto.response.*;
import com.academic.projectmonitoring.security.UserPrincipal;
import com.academic.projectmonitoring.service.AuditLogService;
import com.academic.projectmonitoring.service.ProjectHeadService;
import com.academic.projectmonitoring.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/head")
@PreAuthorize("hasAuthority('ROLE_PROJECT_HEAD')")
public class ProjectHeadController {

    private final ProjectHeadService projectHeadService;
    private final ReportService reportService;
    private final AuditLogService auditLogService;

    public ProjectHeadController(ProjectHeadService projectHeadService,
                                 ReportService reportService,
                                 AuditLogService auditLogService) {
        this.projectHeadService = projectHeadService;
        this.reportService = reportService;
        this.auditLogService = auditLogService;
    }

    // Dashboard
    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats(@RequestParam(required = false) Long academicYearId) {
        DashboardStatsDto stats = projectHeadService.getDashboardStats(academicYearId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics retrieved", stats));
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers(@RequestParam(required = false) String role,
                                                                 @RequestParam(required = false) String search) {
        List<UserDto> users = projectHeadService.getAllUsers(role, search);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                          @Valid @RequestBody CreateUserRequest request) {
        UserDto userDto = projectHeadService.createUser(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User created successfully", userDto));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                             @PathVariable Long id) {
        projectHeadService.toggleUserActive(id, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User status updated"));
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                          @PathVariable Long id,
                                                          @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        projectHeadService.resetUserPassword(id, newPassword, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully"));
    }

    // Guides & Students
    @GetMapping("/guides")
    public ResponseEntity<ApiResponse<List<GuideDto>>> getAllGuides() {
        List<GuideDto> guides = projectHeadService.getAllGuides();
        return ResponseEntity.ok(ApiResponse.success("Guides retrieved", guides));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents(@RequestParam(required = false) Long academicYearId) {
        List<StudentDto> students = projectHeadService.getAllStudents(academicYearId);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", students));
    }

    // Groups & Guide Allocation
    @GetMapping("/groups")
    public ResponseEntity<ApiResponse<List<GroupDto>>> getAllGroups(@RequestParam(required = false) Long academicYearId) {
        List<GroupDto> groups = projectHeadService.getAllGroups(academicYearId);
        return ResponseEntity.ok(ApiResponse.success("Groups retrieved", groups));
    }

    @PostMapping("/groups")
    public ResponseEntity<ApiResponse<GroupDto>> createGroup(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                            @Valid @RequestBody CreateGroupRequest request) {
        GroupDto groupDto = projectHeadService.createGroup(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Group created successfully", groupDto));
    }

    @PostMapping("/allocate-guide")
    public ResponseEntity<ApiResponse<Void>> allocateGuide(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                          @Valid @RequestBody AllocateGuideRequest request) {
        projectHeadService.allocateGuide(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Guide allocated successfully"));
    }

    // Projects
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getAllProjects(@RequestParam(required = false) Long academicYearId) {
        List<ProjectDto> projects = projectHeadService.getAllProjects(academicYearId);
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved", projects));
    }

    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                @Valid @RequestBody CreateProjectRequest request) {
        ProjectDto projectDto = projectHeadService.createProject(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Project created successfully", projectDto));
    }

    // Milestones & Presentations Configuration
    @GetMapping("/milestones")
    public ResponseEntity<ApiResponse<List<MilestoneDto>>> getMilestones(@RequestParam(required = false) Long academicYearId) {
        List<MilestoneDto> milestones = projectHeadService.getMilestonesConfig(academicYearId);
        return ResponseEntity.ok(ApiResponse.success("Milestones retrieved", milestones));
    }

    @PostMapping("/milestones")
    public ResponseEntity<ApiResponse<Void>> saveMilestoneConfig(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                @Valid @RequestBody MilestoneConfigRequest request) {
        projectHeadService.saveMilestoneConfig(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Milestone configuration saved"));
    }

    @PostMapping("/configure-presentations")
    public ResponseEntity<ApiResponse<Void>> configurePresentations(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                   @Valid @RequestBody PresentationConfigRequest request) {
        projectHeadService.configurePresentations(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Presentations configured successfully"));
    }

    // Notices
    @GetMapping("/notices")
    public ResponseEntity<ApiResponse<List<NoticeDto>>> getAllNotices() {
        List<NoticeDto> notices = projectHeadService.getAllNotices();
        return ResponseEntity.ok(ApiResponse.success("Notices retrieved", notices));
    }

    @PostMapping("/notices")
    public ResponseEntity<ApiResponse<NoticeDto>> createNotice(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                              @Valid @RequestBody CreateNoticeRequest request) {
        NoticeDto noticeDto = projectHeadService.createNotice(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notice published successfully", noticeDto));
    }

    // Reports
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<ReportDto>> getReport(@RequestParam(defaultValue = "PROJECT_PROGRESS") String type,
                                                           @RequestParam(required = false) Long academicYearId,
                                                           @RequestParam(required = false) Long guideId,
                                                           @RequestParam(required = false) String status) {
        ReportDto report = reportService.generateReport(type, academicYearId, guideId, status);
        return ResponseEntity.ok(ApiResponse.success("Report generated", report));
    }

    // Audit Logs
    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs() {
        List<AuditLogDto> logs = auditLogService.getAllLogs();
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", logs));
    }
}
