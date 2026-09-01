package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.dto.request.*;
import com.academic.projectmonitoring.dto.response.*;
import com.academic.projectmonitoring.entity.*;
import com.academic.projectmonitoring.entity.enums.*;
import com.academic.projectmonitoring.exception.BadRequestException;
import com.academic.projectmonitoring.exception.ResourceNotFoundException;
import com.academic.projectmonitoring.exception.UnauthorizedException;
import com.academic.projectmonitoring.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GuideService {

    private final GuideRepository guideRepository;
    private final GuideAllocationRepository guideAllocationRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMilestoneRepository projectMilestoneRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionVersionRepository submissionVersionRepository;
    private final ReviewRepository reviewRepository;
    private final FeedbackTemplateRepository feedbackTemplateRepository;
    private final PresentationRepository presentationRepository;
    private final PresentationEvaluationRepository presentationEvaluationRepository;
    private final MeetingRepository meetingRepository;
    private final NoticeRepository noticeRepository;
    private final StudentRequestRepository studentRequestRepository;
    private final ProjectGroupRepository projectGroupRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final ProjectDiaryEntryRepository projectDiaryEntryRepository;
    private final DiaryAttendanceRepository diaryAttendanceRepository;
    private final StudentRepository studentRepository;

    public GuideService(GuideRepository guideRepository,
                        GuideAllocationRepository guideAllocationRepository,
                        ProjectRepository projectRepository,
                        ProjectMilestoneRepository projectMilestoneRepository,
                        SubmissionRepository submissionRepository,
                        SubmissionVersionRepository submissionVersionRepository,
                        ReviewRepository reviewRepository,
                        FeedbackTemplateRepository feedbackTemplateRepository,
                        PresentationRepository presentationRepository,
                        PresentationEvaluationRepository presentationEvaluationRepository,
                        MeetingRepository meetingRepository,
                        NoticeRepository noticeRepository,
                        StudentRequestRepository studentRequestRepository,
                        ProjectGroupRepository projectGroupRepository,
                        AuditLogService auditLogService,
                        NotificationService notificationService,
                        ProjectLifecycleService projectLifecycleService,
                        ProjectHeadService projectHeadService,
                        ProjectDiaryEntryRepository projectDiaryEntryRepository,
                        DiaryAttendanceRepository diaryAttendanceRepository,
                        StudentRepository studentRepository) {
        this.guideRepository = guideRepository;
        this.guideAllocationRepository = guideAllocationRepository;
        this.projectRepository = projectRepository;
        this.projectMilestoneRepository = projectMilestoneRepository;
        this.submissionRepository = submissionRepository;
        this.submissionVersionRepository = submissionVersionRepository;
        this.reviewRepository = reviewRepository;
        this.feedbackTemplateRepository = feedbackTemplateRepository;
        this.presentationRepository = presentationRepository;
        this.presentationEvaluationRepository = presentationEvaluationRepository;
        this.meetingRepository = meetingRepository;
        this.noticeRepository = noticeRepository;
        this.studentRequestRepository = studentRequestRepository;
        this.projectGroupRepository = projectGroupRepository;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
        this.projectLifecycleService = projectLifecycleService;
        this.projectHeadService = projectHeadService;
        this.projectDiaryEntryRepository = projectDiaryEntryRepository;
        this.diaryAttendanceRepository = diaryAttendanceRepository;
        this.studentRepository = studentRepository;
    }

    // =========================================================================
    // 1. GUIDE DASHBOARD
    // =========================================================================
    @Transactional(readOnly = true)
    public DashboardStatsDto getGuideDashboardStats(Long userId) {
        Guide guide = getGuideByUserId(userId);

        DashboardStatsDto stats = new DashboardStatsDto();
        List<GuideAllocation> allocations = guideAllocationRepository.findByGuideIdAndActiveTrue(guide.getId());
        stats.setTotalGroups(allocations.size());

        List<Project> myProjects = projectRepository.findByGuideId(guide.getId());
        stats.setTotalProjects(myProjects.size());
        stats.setActiveProjects(myProjects.stream().filter(p -> p.getStatus() != ProjectStatus.COMPLETED).count());
        stats.setCompletedProjects(myProjects.stream().filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count());
        stats.setDelayedProjects(myProjects.stream().filter(p -> p.getStatus() == ProjectStatus.DELAYED).count());

        List<Submission> pendingSubs = submissionRepository.findPendingSubmissionsForGuideUser(userId);
        stats.setPendingReviews(pendingSubs.size());
        stats.setPendingSubmissions(pendingSubs.size());

        List<Presentation> presentations = presentationRepository.findByGuideId(guide.getId());
        stats.setUpcomingPresentationsCount(presentations.stream().filter(p -> p.getStatus() == PresentationStatus.SCHEDULED).count());

        stats.setPendingSubmissionsList(pendingSubs.stream().map(this::mapSubmissionToDto).collect(Collectors.toList()));
        stats.setUpcomingPresentations(presentations.stream().filter(p -> p.getStatus() == PresentationStatus.SCHEDULED).limit(5).map(this::mapPresentationToDto).collect(Collectors.toList()));

        // Active Notices relevant to Guide
        stats.setActiveNotices(noticeRepository.findActiveNoticesForGuide(LocalDate.now(), userId).stream().limit(5).map(projectHeadService::mapNoticeToDto).collect(Collectors.toList()));

        return stats;
    }

    // =========================================================================
    // 2. ASSIGNED GROUPS & PROJECTS
    // =========================================================================
    @Transactional(readOnly = true)
    public List<GroupDto> getMyAssignedGroups(Long userId) {
        Guide guide = getGuideByUserId(userId);
        return guideAllocationRepository.findByGuideIdAndActiveTrue(guide.getId()).stream()
                .map(a -> projectHeadService.mapGroupToDto(a.getGroup()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectDetailsForGuide(Long projectId, Long userId) {
        Guide guide = getGuideByUserId(userId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        validateGuideAccessToGroup(guide.getId(), project.getGroup().getId());
        return projectHeadService.mapProjectToDto(project);
    }

    // =========================================================================
    // 3. SUBMISSION REVIEW, OFFLINE MARKING & CORRECTIONS
    // =========================================================================
    @Transactional(readOnly = true)
    public List<SubmissionDto> getGuideSubmissions(Long userId) {
        Guide guide = getGuideByUserId(userId);
        return submissionRepository.findByGuideId(guide.getId()).stream()
                .map(this::mapSubmissionToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubmissionDto markOfflineSubmission(MarkOfflineSubmissionRequest request, Long userId, String username) {
        Guide guide = getGuideByUserId(userId);
        ProjectMilestone pm = projectMilestoneRepository.findById(request.getProjectMilestoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));

        validateGuideAccessToGroup(guide.getId(), pm.getProject().getGroup().getId());

        Submission submission = submissionRepository.findByProjectMilestoneId(pm.getId())
                .orElseGet(() -> new Submission(pm, pm.getProject(), pm.getProject().getGroup(), pm.getMilestone().getTitle().toUpperCase().replaceAll(" ", "_")));

        submission.setStatus(SubmissionStatus.OFFLINE_SUBMITTED);
        submission.setLastSubmittedAt(LocalDateTime.now());
        submissionRepository.save(submission);

        int nextVersion = submission.getVersions().isEmpty() ? 1 : submission.getVersions().get(0).getVersionNumber() + 1;
        submission.setCurrentVersion(nextVersion);

        SubmissionVersion version = new SubmissionVersion(
                submission,
                nextVersion,
                SubmissionMode.OFFLINE,
                null,
                "Physical / Offline Hardcopy Submission",
                0L,
                request.getNotes() != null ? request.getNotes() : "Marked submitted physically by Guide",
                guide.getUser()
        );
        submissionVersionRepository.save(version);

        pm.setStatus(MilestoneStatus.SUBMITTED);
        projectMilestoneRepository.save(pm);

        projectLifecycleService.recalculateProjectProgress(pm.getProject());

        // Notify Students
        pm.getProject().getGroup().getMembers().forEach(m -> {
            notificationService.sendNotification(m.getStudent().getUser(), "Offline Submission Acknowledged",
                    "Your " + pm.getMilestone().getTitle() + " has been marked as OFFLINE SUBMITTED by your Guide.",
                    "SUBMISSION", submission.getId());
        });

        auditLogService.log(userId, username, "ROLE_GUIDE",
                "MARK_OFFLINE_SUBMISSION", "SUBMISSION", submission.getId(),
                "Marked offline submission for " + pm.getMilestone().getTitle() + " (Group " + pm.getProject().getGroup().getGroupNumber() + ")");

        return mapSubmissionToDto(submissionRepository.findById(submission.getId()).get());
    }

    @Transactional
    public SubmissionDto reviewSubmission(ReviewSubmissionRequest request, Long userId, String username) {
        Guide guide = getGuideByUserId(userId);
        SubmissionVersion version = submissionVersionRepository.findById(request.getSubmissionVersionId())
                .orElseThrow(() -> new ResourceNotFoundException("Submission version not found"));

        Submission submission = version.getSubmission();
        ProjectMilestone pm = submission.getProjectMilestone();
        validateGuideAccessToGroup(guide.getId(), submission.getGroup().getId());

        FeedbackTemplate template = null;
        if (request.getPredefinedFeedbackId() != null) {
            template = feedbackTemplateRepository.findById(request.getPredefinedFeedbackId()).orElse(null);
        }

        String templateText = request.getPredefinedFeedbackText();
        if (templateText == null && template != null) {
            templateText = template.getMessageTemplate();
        }

        String verdict = request.getVerdict().toUpperCase();
        if (!"VERIFIED".equals(verdict) && !"CORRECTION_REQUIRED".equals(verdict)) {
            throw new BadRequestException("Verdict must be either VERIFIED or CORRECTION_REQUIRED");
        }

        Review review = new Review(
                version,
                submission,
                guide,
                verdict,
                template,
                templateText,
                request.getCustomRemarks()
        );
        reviewRepository.save(review);

        if ("VERIFIED".equals(verdict)) {
            submission.setStatus(SubmissionStatus.VERIFIED);
            pm.setStatus(MilestoneStatus.COMPLETED);
            pm.setCompletedAt(LocalDateTime.now());
        } else {
            submission.setStatus(SubmissionStatus.CORRECTION_REQUIRED);
            pm.setStatus(MilestoneStatus.CORRECTION_REQUIRED);
        }

        submissionRepository.save(submission);
        projectMilestoneRepository.save(pm);

        projectLifecycleService.recalculateProjectProgress(pm.getProject());

        // Send notifications to group students
        String notifMsg = "VERIFIED".equals(verdict)
                ? "Your " + pm.getMilestone().getTitle() + " has been VERIFIED and APPROVED by Prof. " + guide.getUser().getFullName()
                : "Correction Required for " + pm.getMilestone().getTitle() + ". Please review feedback remarks and resubmit.";

        submission.getGroup().getMembers().forEach(m -> {
            notificationService.sendNotification(m.getStudent().getUser(),
                    "VERIFIED".equals(verdict) ? "Submission Verified" : "Correction Required",
                    notifMsg, "REVIEW", submission.getId());
        });

        auditLogService.log(userId, username, "ROLE_GUIDE",
                "REVIEW_SUBMISSION", "REVIEW", review.getId(),
                "Reviewed version " + version.getVersionNumber() + " for " + pm.getMilestone().getTitle() + " with verdict: " + verdict);

        return mapSubmissionToDto(submissionRepository.findById(submission.getId()).get());
    }

    // =========================================================================
    // 4. PRESENTATIONS EVALUATION & MARKS
    // =========================================================================
    @Transactional(readOnly = true)
    public List<PresentationDto> getGuidePresentations(Long userId) {
        Guide guide = getGuideByUserId(userId);
        return presentationRepository.findByGuideId(guide.getId()).stream()
                .map(this::mapPresentationToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PresentationDto evaluatePresentation(Long presentationId, EvaluatePresentationRequest request, Long userId, String username) {
        Guide guide = getGuideByUserId(userId);
        Presentation presentation = presentationRepository.findById(presentationId)
                .orElseThrow(() -> new ResourceNotFoundException("Presentation not found"));

        validateGuideAccessToGroup(guide.getId(), presentation.getProject().getGroup().getId());

        PresentationEvaluation eval = presentationEvaluationRepository.findByPresentationId(presentation.getId())
                .orElseGet(() -> new PresentationEvaluation(presentation, guide, request.getMarksObtained(),
                        request.getMaxMarks(), request.getRemarks(), request.getAttendanceStatus()));

        eval.setMarksObtained(request.getMarksObtained());
        if (request.getMaxMarks() != null) eval.setMaxMarks(request.getMaxMarks());
        eval.setRemarks(request.getRemarks());
        eval.setAttendanceStatus(request.getAttendanceStatus());
        presentationEvaluationRepository.save(eval);

        presentation.setStatus(PresentationStatus.COMPLETED);
        presentationRepository.save(presentation);

        // Notify Students of Presentation Evaluation & Marks
        presentation.getProject().getGroup().getMembers().forEach(m -> {
            notificationService.sendNotification(m.getStudent().getUser(), "Presentation Evaluated",
                    presentation.getTitle() + " has been evaluated. Marks: " + eval.getMarksObtained() + " / " + eval.getMaxMarks(),
                    "PRESENTATION", presentation.getId());
        });

        auditLogService.log(userId, username, "ROLE_GUIDE",
                "EVALUATE_PRESENTATION", "PRESENTATION", presentation.getId(),
                "Evaluated " + presentation.getTitle() + " for group " + presentation.getProject().getGroup().getGroupNumber() + " with marks " + eval.getMarksObtained());

        return mapPresentationToDto(presentationRepository.findById(presentation.getId()).get());
    }

    // =========================================================================
    // 5. MEETINGS MANAGEMENT
    // =========================================================================
    @Transactional
    public MeetingDto createMeeting(CreateMeetingRequest request, Long userId, String username) {
        Guide guide = getGuideByUserId(userId);
        ProjectGroup group = projectGroupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        validateGuideAccessToGroup(guide.getId(), group.getId());

        Meeting meeting = new Meeting(
                guide,
                group,
                request.getTitle(),
                request.getMeetingDate(),
                request.getMeetingTime(),
                request.getVenue(),
                request.getPurpose()
        );
        meetingRepository.save(meeting);

        // Notify Group members
        group.getMembers().forEach(m -> {
            notificationService.sendNotification(m.getStudent().getUser(), "New Meeting Scheduled",
                    "Guide " + guide.getUser().getFullName() + " scheduled a meeting: '" + meeting.getTitle() + "' on " + meeting.getMeetingDate() + " at " + meeting.getMeetingTime(),
                    "MEETING", meeting.getId());
        });

        auditLogService.log(userId, username, "ROLE_GUIDE",
                "CREATE_MEETING", "MEETING", meeting.getId(),
                "Scheduled meeting '" + meeting.getTitle() + "' for group " + group.getGroupNumber());

        return mapMeetingToDto(meeting);
    }

    @Transactional(readOnly = true)
    public List<MeetingDto> getGuideMeetings(Long userId) {
        Guide guide = getGuideByUserId(userId);
        return meetingRepository.findByGuideIdOrderByMeetingDateDesc(guide.getId()).stream()
                .map(this::mapMeetingToDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // 6. NOTICES & STUDENT REQUESTS
    // =========================================================================
    @Transactional
    public NoticeDto createGuideNotice(CreateNoticeRequest request, Long userId, String username) {
        Guide guide = getGuideByUserId(userId);

        ProjectGroup targetGroup = null;
        if (request.getTargetGroupId() != null) {
            targetGroup = projectGroupRepository.findById(request.getTargetGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target group not found"));
            validateGuideAccessToGroup(guide.getId(), targetGroup.getId());
        }

        Notice notice = new Notice(
                request.getTitle(),
                request.getDescription(),
                NoticePriority.valueOf(request.getPriority()),
                NoticeTarget.SPECIFIC_GROUP,
                targetGroup,
                request.getFromDate(),
                request.getToDate(),
                guide.getUser()
        );
        noticeRepository.save(notice);

        // Notify target group
        if (targetGroup != null) {
            targetGroup.getMembers().forEach(m -> {
                notificationService.sendNotification(m.getStudent().getUser(), "New Notice from Guide",
                        notice.getTitle(), "NOTICE", notice.getId());
            });
        }

        auditLogService.log(userId, username, "ROLE_GUIDE",
                "CREATE_NOTICE", "NOTICE", notice.getId(),
                "Guide published notice '" + notice.getTitle() + "' to group " + (targetGroup != null ? targetGroup.getGroupNumber() : "all assigned groups"));

        return projectHeadService.mapNoticeToDto(notice);
    }

    @Transactional(readOnly = true)
    public List<StudentRequestResponseDto> getStudentRequestsForGuide(Long userId) {
        Guide guide = getGuideByUserId(userId);
        return studentRequestRepository.findByGuideIdOrderByCreatedAtDesc(guide.getId()).stream()
                .map(this::mapStudentRequestToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void respondToStudentRequest(Long requestId, RespondStudentRequestDto responseDto, Long userId, String username) {
        Guide guide = getGuideByUserId(userId);
        StudentRequest req = studentRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!req.getGuide().getId().equals(guide.getId())) {
            throw new UnauthorizedException("You are not authorized to respond to this request");
        }

        req.setGuideResponse(responseDto.getResponse());
        req.setStatus(StudentRequestStatus.CLOSED);
        req.setRespondedAt(LocalDateTime.now());
        studentRequestRepository.save(req);

        // Notify student
        notificationService.sendNotification(req.getStudent().getUser(), "Guide Responded to Request",
                "Prof. " + guide.getUser().getFullName() + " replied: " + responseDto.getResponse(),
                "STUDENT_REQUEST", req.getId());

        auditLogService.log(userId, username, "ROLE_GUIDE",
                "RESPOND_STUDENT_REQUEST", "STUDENT_REQUEST", req.getId(),
                "Responded to student inquiry: " + req.getPredefinedQuestion().getDisplayLabel());
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================
    public Guide getGuideByUserId(Long userId) {
        return guideRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Guide profile not found for user ID: " + userId));
    }

    public void validateGuideAccessToGroup(Long guideId, Long groupId) {
        Optional<GuideAllocation> alloc = guideAllocationRepository.findByGroupIdAndActiveTrue(groupId);
        if (alloc.isEmpty() || !alloc.get().getGuide().getId().equals(guideId)) {
            throw new UnauthorizedException("You are not assigned as the Guide for this student group.");
        }
    }

    public SubmissionDto mapSubmissionToDto(Submission submission) {
        SubmissionDto dto = new SubmissionDto();
        dto.setId(submission.getId());
        dto.setProjectMilestoneId(submission.getProjectMilestone().getId());
        dto.setMilestoneTitle(submission.getProjectMilestone().getMilestone().getTitle());
        dto.setProjectId(submission.getProject().getId());
        dto.setProjectTitle(submission.getProject().getTitle());
        dto.setGroupId(submission.getGroup().getId());
        dto.setGroupNumber(submission.getGroup().getGroupNumber());
        dto.setSubmissionType(submission.getSubmissionType());
        dto.setCurrentVersion(submission.getCurrentVersion());
        dto.setStatus(submission.getStatus());
        dto.setLastSubmittedAt(submission.getLastSubmittedAt());

        dto.setVersions(submission.getVersions().stream().map(v -> {
            SubmissionDto.SubmissionVersionDto vDto = new SubmissionDto.SubmissionVersionDto();
            vDto.setId(v.getId());
            vDto.setVersionNumber(v.getVersionNumber());
            vDto.setSubmissionMode(v.getSubmissionMode());
            vDto.setFileName(v.getFileName());
            vDto.setFileSize(v.getFileSize());
            vDto.setStudentNotes(v.getStudentNotes());
            vDto.setSubmittedById(v.getSubmittedBy().getId());
            vDto.setSubmittedByName(v.getSubmittedBy().getFullName());
            vDto.setSubmittedAt(v.getSubmittedAt());

            if (v.getReview() != null) {
                ReviewDto rDto = mapReviewToDto(v.getReview());
                vDto.setReview(rDto);
            }
            return vDto;
        }).collect(Collectors.toList()));

        dto.setReviews(submission.getReviews().stream().map(this::mapReviewToDto).collect(Collectors.toList()));
        return dto;
    }

    public ReviewDto mapReviewToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setSubmissionVersionId(review.getSubmissionVersion().getId());
        dto.setSubmissionId(review.getSubmission().getId());
        dto.setGuideId(review.getGuide().getId());
        dto.setGuideName(review.getGuide().getUser().getFullName());
        dto.setVerdict(review.getVerdict());
        if (review.getPredefinedFeedback() != null) {
            dto.setPredefinedFeedbackId(review.getPredefinedFeedback().getId());
            dto.setPredefinedFeedbackCode(review.getPredefinedFeedback().getCode());
            dto.setPredefinedFeedbackTitle(review.getPredefinedFeedback().getTitle());
        }
        dto.setPredefinedFeedbackText(review.getPredefinedFeedbackText());
        dto.setCustomRemarks(review.getCustomRemarks());
        dto.setReviewedAt(review.getReviewedAt());
        return dto;
    }

    public PresentationDto mapPresentationToDto(Presentation presentation) {
        PresentationDto dto = new PresentationDto();
        dto.setId(presentation.getId());
        dto.setAcademicYearId(presentation.getAcademicYear().getId());
        dto.setProjectId(presentation.getProject().getId());
        dto.setProjectTitle(presentation.getProject().getTitle());
        dto.setGroupId(presentation.getProject().getGroup().getId());
        dto.setGroupNumber(presentation.getProject().getGroup().getGroupNumber());
        dto.setPresentationNumber(presentation.getPresentationNumber());
        dto.setTitle(presentation.getTitle());
        dto.setScheduledDate(presentation.getScheduledDate());
        dto.setStartTime(presentation.getStartTime());
        dto.setEndTime(presentation.getEndTime());
        dto.setVenue(presentation.getVenue());
        dto.setDescription(presentation.getDescription());
        dto.setStatus(presentation.getStatus());

        if (presentation.getEvaluation() != null) {
            PresentationEvaluation eval = presentation.getEvaluation();
            PresentationDto.PresentationEvaluationDto eDto = new PresentationDto.PresentationEvaluationDto();
            eDto.setId(eval.getId());
            eDto.setGuideId(eval.getGuide().getId());
            eDto.setGuideName(eval.getGuide().getUser().getFullName());
            eDto.setMarksObtained(eval.getMarksObtained());
            eDto.setMaxMarks(eval.getMaxMarks());
            eDto.setRemarks(eval.getRemarks());
            eDto.setAttendanceStatus(eval.getAttendanceStatus());
            eDto.setEvaluatedAt(eval.getEvaluatedAt());
            dto.setEvaluation(eDto);
        }
        return dto;
    }

    public MeetingDto mapMeetingToDto(Meeting meeting) {
        MeetingDto dto = new MeetingDto();
        dto.setId(meeting.getId());
        dto.setGuideId(meeting.getGuide().getId());
        dto.setGuideName(meeting.getGuide().getUser().getFullName());
        dto.setGroupId(meeting.getGroup().getId());
        dto.setGroupNumber(meeting.getGroup().getGroupNumber());
        dto.setTitle(meeting.getTitle());
        dto.setMeetingDate(meeting.getMeetingDate());
        dto.setMeetingTime(meeting.getMeetingTime());
        dto.setVenue(meeting.getVenue());
        dto.setPurpose(meeting.getPurpose());
        dto.setStatus(meeting.getStatus());
        dto.setCreatedAt(meeting.getCreatedAt());
        return dto;
    }

    public StudentRequestResponseDto mapStudentRequestToDto(StudentRequest request) {
        StudentRequestResponseDto dto = new StudentRequestResponseDto();
        dto.setId(request.getId());
        dto.setGroupId(request.getGroup().getId());
        dto.setGroupNumber(request.getGroup().getGroupNumber());
        dto.setStudentId(request.getStudent().getId());
        dto.setStudentName(request.getStudent().getUser().getFullName());
        dto.setGuideId(request.getGuide().getId());
        dto.setGuideName(request.getGuide().getUser().getFullName());
        dto.setPredefinedQuestion(request.getPredefinedQuestion());
        dto.setQuestionLabel(request.getPredefinedQuestion().getDisplayLabel());
        dto.setAdditionalNote(request.getAdditionalNote());
        dto.setStatus(request.getStatus());
        dto.setGuideResponse(request.getGuideResponse());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setRespondedAt(request.getRespondedAt());
        return dto;
    }

    // =========================================================================
    // 7. ALL SUBMISSIONS (CROSS-DEPARTMENT VIEW)
    // =========================================================================
    @Transactional(readOnly = true)
    public List<SubmissionDto> getAllDepartmentSubmissions() {
        return submissionRepository.findAll().stream()
                .map(this::mapSubmissionToDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // 8. PROJECT DIARY & ATTENDANCE LOGGING
    // =========================================================================
    @Transactional
    public ProjectDiaryDto createDiaryEntry(DiaryEntryRequest request, Long userId, String username) {
        Guide guide = getGuideByUserId(userId);
        ProjectGroup group = projectGroupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Project group not found"));

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId()).orElse(null);
        } else {
            project = projectRepository.findByGroupId(group.getId()).orElse(null);
        }

        ProjectDiaryEntry diaryEntry = new ProjectDiaryEntry(
                group,
                project,
                guide,
                request.getMeetingDate(),
                request.getMeetingTime(),
                request.getVenue(),
                request.getDiscussionPoints(),
                request.getGuidanceGiven(),
                request.getTargetForNextMeeting()
        );
        diaryEntry = projectDiaryEntryRepository.save(diaryEntry);

        if (request.getAttendances() != null) {
            List<DiaryAttendance> attendanceList = new ArrayList<>();
            for (DiaryEntryRequest.StudentAttendanceItem item : request.getAttendances()) {
                Student student = studentRepository.findById(item.getStudentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + item.getStudentId()));
                DiaryAttendance attendance = new DiaryAttendance(
                        diaryEntry,
                        student,
                        item.isPresent(),
                        item.getWorkSummary(),
                        item.getRemarks()
                );
                attendanceList.add(diaryAttendanceRepository.save(attendance));
            }
            diaryEntry.setAttendances(attendanceList);
        }

        auditLogService.log(userId, username, "ROLE_GUIDE",
                "CREATE_DIARY_ENTRY", "PROJECT_DIARY", diaryEntry.getId(),
                "Logged Project Diary entry with attendance for " + group.getGroupNumber() + " on " + request.getMeetingDate());

        return mapDiaryToDto(diaryEntry);
    }

    @Transactional(readOnly = true)
    public List<ProjectDiaryDto> getDiaryEntriesForGroup(Long groupId) {
        return projectDiaryEntryRepository.findByGroupIdOrderByMeetingDateDesc(groupId).stream()
                .map(this::mapDiaryToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectDiaryDto> getMyGuideDiaryEntries(Long userId) {
        Guide guide = getGuideByUserId(userId);
        return projectDiaryEntryRepository.findByGuideIdOrderByMeetingDateDesc(guide.getId()).stream()
                .map(this::mapDiaryToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteDiaryEntry(Long diaryId, Long userId, String username) {
        Guide guide = getGuideByUserId(userId);
        ProjectDiaryEntry entry = projectDiaryEntryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Diary entry not found"));

        if (!entry.getGuide().getId().equals(guide.getId())) {
            throw new UnauthorizedException("You can only delete your own diary entries.");
        }

        projectDiaryEntryRepository.delete(entry);
        auditLogService.log(userId, username, "ROLE_GUIDE",
                "DELETE_DIARY_ENTRY", "PROJECT_DIARY", diaryId,
                "Deleted project diary entry ID: " + diaryId);
    }

    public ProjectDiaryDto mapDiaryToDto(ProjectDiaryEntry entry) {
        ProjectDiaryDto dto = new ProjectDiaryDto();
        dto.setId(entry.getId());
        dto.setGroupId(entry.getGroup().getId());
        dto.setGroupNumber(entry.getGroup().getGroupNumber());
        if (entry.getProject() != null) {
            dto.setProjectId(entry.getProject().getId());
            dto.setProjectTitle(entry.getProject().getTitle());
        }
        dto.setGuideId(entry.getGuide().getId());
        dto.setGuideName(entry.getGuide().getUser().getFullName());
        dto.setMeetingDate(entry.getMeetingDate());
        dto.setMeetingTime(entry.getMeetingTime());
        dto.setVenue(entry.getVenue());
        dto.setDiscussionPoints(entry.getDiscussionPoints());
        dto.setGuidanceGiven(entry.getGuidanceGiven());
        dto.setTargetForNextMeeting(entry.getTargetForNextMeeting());
        dto.setCreatedAt(entry.getCreatedAt());

        if (entry.getAttendances() != null) {
            dto.setAttendances(entry.getAttendances().stream().map(a -> new DiaryAttendanceDto(
                    a.getId(),
                    a.getStudent().getId(),
                    a.getStudent().getUser().getFullName(),
                    a.getStudent().getRollNumber(),
                    a.isPresent(),
                    a.getWorkSummary(),
                    a.getRemarks()
            )).collect(Collectors.toList()));
        }
        return dto;
    }
}
