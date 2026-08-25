package com.academic.projectmonitoring.service;

import com.academic.projectmonitoring.dto.request.ChangePasswordRequest;
import com.academic.projectmonitoring.dto.request.LoginRequest;
import com.academic.projectmonitoring.dto.response.JwtAuthResponse;
import com.academic.projectmonitoring.dto.response.UserDto;
import com.academic.projectmonitoring.entity.GroupMember;
import com.academic.projectmonitoring.entity.Guide;
import com.academic.projectmonitoring.entity.Student;
import com.academic.projectmonitoring.entity.User;
import com.academic.projectmonitoring.exception.BadRequestException;
import com.academic.projectmonitoring.exception.ResourceNotFoundException;
import com.academic.projectmonitoring.repository.GroupMemberRepository;
import com.academic.projectmonitoring.repository.GuideRepository;
import com.academic.projectmonitoring.repository.StudentRepository;
import com.academic.projectmonitoring.repository.UserRepository;
import com.academic.projectmonitoring.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final GuideRepository guideRepository;
    private final StudentRepository studentRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserRepository userRepository,
                       GuideRepository guideRepository,
                       StudentRepository studentRepository,
                       GroupMemberRepository groupMemberRepository,
                       PasswordEncoder passwordEncoder,
                       AuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.guideRepository = guideRepository;
        this.studentRepository = studentRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("Account is disabled. Please contact the Project Head.");
        }

        Long referenceId = null;
        Long groupId = null;

        if ("ROLE_GUIDE".equals(user.getRole().getName().name())) {
            Optional<Guide> guideOpt = guideRepository.findByUserId(user.getId());
            if (guideOpt.isPresent()) {
                referenceId = guideOpt.get().getId();
            }
        } else if ("ROLE_STUDENT".equals(user.getRole().getName().name())) {
            Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                referenceId = studentOpt.get().getId();
                Optional<GroupMember> memberOpt = groupMemberRepository.findByStudentId(referenceId);
                if (memberOpt.isPresent()) {
                    groupId = memberOpt.get().getGroup().getId();
                }
            }
        }

        // Audit login
        auditLogService.log(user.getId(), user.getUsername(), user.getRole().getName().name(),
                "LOGIN_SUCCESS", "USER", user.getId(), "User logged in successfully.");

        return new JwtAuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole().getName().name(),
                user.getEmail(),
                user.getPhone(),
                referenceId,
                groupId
        );
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate old password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            auditLogService.log(user.getId(), user.getUsername(), user.getRole().getName().name(),
                    "PASSWORD_CHANGE_FAILED", "USER", user.getId(), "Incorrect current password entered.");
            throw new BadRequestException("Current password does not match our records.");
        }

        // Validate new password confirmation
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("New password and confirm new password do not match.");
        }

        if (request.getNewPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters in length.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Audit password change
        auditLogService.log(user.getId(), user.getUsername(), user.getRole().getName().name(),
                "PASSWORD_CHANGE_SUCCESS", "USER", user.getId(), "Password updated successfully using current password.");
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDto dto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getName().name(),
                user.isActive(),
                user.getCreatedAt()
        );

        if ("ROLE_GUIDE".equals(user.getRole().getName().name())) {
            guideRepository.findByUserId(user.getId()).ifPresent(dto::setProfileDetails);
        } else if ("ROLE_STUDENT".equals(user.getRole().getName().name())) {
            studentRepository.findByUserId(user.getId()).ifPresent(dto::setProfileDetails);
        }

        return dto;
    }
}
