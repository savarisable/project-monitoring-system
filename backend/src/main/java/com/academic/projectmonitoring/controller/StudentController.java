package com.academic.projectmonitoring.controller;

import com.academic.projectmonitoring.dto.request.StudentRequestDto;
import com.academic.projectmonitoring.dto.request.SubmitDocumentRequest;
import com.academic.projectmonitoring.dto.response.*;
import com.academic.projectmonitoring.security.UserPrincipal;
import com.academic.projectmonitoring.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasAuthority('ROLE_STUDENT')")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Dashboard
    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardStatsDto stats = studentService.getStudentDashboardStats(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Student dashboard metrics retrieved", stats));
    }

    // Group & Project
    @GetMapping("/my-group")
    public ResponseEntity<ApiResponse<GroupDto>> getMyGroup(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        GroupDto group = studentService.getMyGroup(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Assigned group retrieved", group));
    }

    @GetMapping("/my-project")
    public ResponseEntity<ApiResponse<ProjectDto>> getMyProject(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProjectDto project = studentService.getMyProject(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Project details retrieved", project));
    }

    // Submissions
    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getMySubmissions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SubmissionDto> submissions = studentService.getMySubmissions(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", submissions));
    }

    @PostMapping(value = "/submissions/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<SubmissionDto>> uploadSubmission(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("projectMilestoneId") Long projectMilestoneId,
            @RequestParam(value = "studentNotes", required = false) String studentNotes,
            @RequestParam("file") MultipartFile file) {

        SubmitDocumentRequest request = new SubmitDocumentRequest(projectMilestoneId, studentNotes);
        SubmissionDto submission = studentService.uploadSubmission(request, file, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Document submitted successfully", submission));
    }

    // Presentations
    @GetMapping("/presentations")
    public ResponseEntity<ApiResponse<List<PresentationDto>>> getMyPresentations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<PresentationDto> presentations = studentService.getMyPresentations(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Presentations schedule retrieved", presentations));
    }

    // Meetings
    @GetMapping("/meetings")
    public ResponseEntity<ApiResponse<List<MeetingDto>>> getMyMeetings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<MeetingDto> meetings = studentService.getMyMeetings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Meetings retrieved", meetings));
    }

    // Notices
    @GetMapping("/notices")
    public ResponseEntity<ApiResponse<List<NoticeDto>>> getMyNotices(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<NoticeDto> notices = studentService.getMyNotices(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Notices retrieved", notices));
    }

    // Predefined Inquiries / Requests
    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<StudentRequestResponseDto>>> getMyRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<StudentRequestResponseDto> requests = studentService.getMyRequests(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Inquiries history retrieved", requests));
    }

    @PostMapping("/send-request")
    public ResponseEntity<ApiResponse<StudentRequestResponseDto>> sendRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody StudentRequestDto requestDto) {
        StudentRequestResponseDto response = studentService.sendPredefinedQuestion(requestDto, userPrincipal.getId(), userPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Inquiry sent to Guide successfully", response));
    }
}
