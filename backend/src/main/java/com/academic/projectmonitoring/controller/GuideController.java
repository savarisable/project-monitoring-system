package com.academic.projectmonitoring.controller;

import com.academic.projectmonitoring.dto.request.*;
import com.academic.projectmonitoring.dto.response.*;
import com.academic.projectmonitoring.security.UserPrincipal;
import com.academic.projectmonitoring.service.GuideService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guide")
@PreAuthorize("hasAuthority('ROLE_GUIDE')")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    // Dashboard
    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardStatsDto stats = guideService.getGuideDashboardStats(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Guide dashboard metrics retrieved", stats));
    }

    // Assigned Groups & Projects
    @GetMapping("/my-groups")
    public ResponseEntity<ApiResponse<List<GroupDto>>> getMyGroups(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<GroupDto> groups = guideService.getMyAssignedGroups(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Assigned groups retrieved", groups));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectDetails(@PathVariable Long id,
                                                                    @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProjectDto project = guideService.getProjectDetailsForGuide(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Project details retrieved", project));
    }

    // Submissions & Reviews
    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getSubmissions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SubmissionDto> submissions = guideService.getGuideSubmissions(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", submissions));
    }

    @PostMapping("/submissions/mark-offline")
    public ResponseEntity<ApiResponse<SubmissionDto>> markOfflineSubmission(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                           @Valid @RequestBody MarkOfflineSubmissionRequest request) {
        SubmissionDto submission = guideService.markOfflineSubmission(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Marked as offline submitted successfully", submission));
    }

    @PostMapping("/submissions/review")
    public ResponseEntity<ApiResponse<SubmissionDto>> reviewSubmission(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                      @Valid @RequestBody ReviewSubmissionRequest request) {
        SubmissionDto submission = guideService.reviewSubmission(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Submission review recorded successfully", submission));
    }

    // Presentations & Evaluations
    @GetMapping("/presentations")
    public ResponseEntity<ApiResponse<List<PresentationDto>>> getPresentations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<PresentationDto> presentations = guideService.getGuidePresentations(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Presentations retrieved", presentations));
    }

    @PostMapping("/presentations/{id}/evaluate")
    public ResponseEntity<ApiResponse<PresentationDto>> evaluatePresentation(@PathVariable Long id,
                                                                            @AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                            @Valid @RequestBody EvaluatePresentationRequest request) {
        PresentationDto presentation = guideService.evaluatePresentation(id, request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Presentation evaluated and marks recorded successfully", presentation));
    }

    // Meetings
    @GetMapping("/meetings")
    public ResponseEntity<ApiResponse<List<MeetingDto>>> getMeetings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<MeetingDto> meetings = guideService.getGuideMeetings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Meetings retrieved", meetings));
    }

    @PostMapping("/meetings")
    public ResponseEntity<ApiResponse<MeetingDto>> createMeeting(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                @Valid @RequestBody CreateMeetingRequest request) {
        MeetingDto meeting = guideService.createMeeting(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Meeting scheduled successfully", meeting));
    }

    // Notices
    @PostMapping("/notices")
    public ResponseEntity<ApiResponse<NoticeDto>> createNotice(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                              @Valid @RequestBody CreateNoticeRequest request) {
        NoticeDto notice = guideService.createGuideNotice(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notice published to group successfully", notice));
    }

    // Student Requests
    @GetMapping("/student-requests")
    public ResponseEntity<ApiResponse<List<StudentRequestResponseDto>>> getStudentRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<StudentRequestResponseDto> requests = guideService.getStudentRequestsForGuide(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Student inquiries retrieved", requests));
    }

    @PostMapping("/student-requests/{id}/respond")
    public ResponseEntity<ApiResponse<Void>> respondToStudentRequest(@PathVariable Long id,
                                                                    @AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                    @Valid @RequestBody RespondStudentRequestDto responseDto) {
        guideService.respondToStudentRequest(id, responseDto, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Response sent to students"));
    }

    // All Submissions (Department-wide view)
    @GetMapping("/all-submissions")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getAllDepartmentSubmissions() {
        List<SubmissionDto> submissions = guideService.getAllDepartmentSubmissions();
        return ResponseEntity.ok(ApiResponse.success("All department submissions retrieved", submissions));
    }

    // Project Diary & Attendance Logging
    @GetMapping("/diary")
    public ResponseEntity<ApiResponse<List<ProjectDiaryDto>>> getDiaryEntries(@RequestParam(required = false) Long groupId,
                                                                             @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ProjectDiaryDto> list = (groupId != null)
                ? guideService.getDiaryEntriesForGroup(groupId)
                : guideService.getMyGuideDiaryEntries(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Project diary entries retrieved", list));
    }

    @PostMapping("/diary")
    public ResponseEntity<ApiResponse<ProjectDiaryDto>> createDiaryEntry(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                         @Valid @RequestBody DiaryEntryRequest request) {
        ProjectDiaryDto dto = guideService.createDiaryEntry(request, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Project diary entry and attendance recorded successfully", dto));
    }

    @DeleteMapping("/diary/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDiaryEntry(@PathVariable Long id,
                                                             @AuthenticationPrincipal UserPrincipal userPrincipal) {
        guideService.deleteDiaryEntry(id, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Project diary entry deleted successfully"));
    }

    // Student Work Logs (Review & Verification)
    @GetMapping("/groups/{groupId}/student-work-logs")
    public ResponseEntity<ApiResponse<List<StudentWorkLogDto>>> getGroupStudentWorkLogs(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<StudentWorkLogDto> logs = guideService.getGroupStudentWorkLogs(groupId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Student work logs retrieved", logs));
    }

    @PostMapping("/student-work-logs/{logId}/verify")
    public ResponseEntity<ApiResponse<StudentWorkLogDto>> verifyStudentWorkLog(
            @PathVariable Long logId,
            @RequestBody(required = false) java.util.Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String remark = body != null ? body.get("guideRemark") : null;
        StudentWorkLogDto updated = guideService.verifyStudentWorkLog(logId, userPrincipal.getId(), remark);
        return ResponseEntity.ok(ApiResponse.success("Student work log verified successfully", updated));
    }
}
