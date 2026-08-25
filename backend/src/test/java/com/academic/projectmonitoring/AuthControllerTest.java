package com.academic.projectmonitoring;

import com.academic.projectmonitoring.dto.request.ChangePasswordRequest;
import com.academic.projectmonitoring.dto.request.LoginRequest;
import com.academic.projectmonitoring.dto.response.JwtAuthResponse;
import com.academic.projectmonitoring.exception.BadRequestException;
import com.academic.projectmonitoring.service.AuthService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class AuthControllerTest {

    @Autowired
    private AuthService authService;

    @Test
    public void testSuccessfulLogin_ProjectHead() {
        LoginRequest loginRequest = new LoginRequest("projecthead", "Project@123");
        JwtAuthResponse response = authService.login(loginRequest);

        Assertions.assertNotNull(response);
        Assertions.assertNotNull(response.getAccessToken());
        Assertions.assertEquals("projecthead", response.getUsername());
        Assertions.assertEquals("ROLE_PROJECT_HEAD", response.getRole());
    }

    @Test
    public void testFailedLogin_InvalidPassword() {
        LoginRequest loginRequest = new LoginRequest("projecthead", "WrongPassword@999");
        Assertions.assertThrows(BadCredentialsException.class, () -> {
            authService.login(loginRequest);
        });
    }

    @Test
    public void testPasswordChange_IncorrectCurrentPasswordFails() {
        LoginRequest loginRequest = new LoginRequest("student01", "Student@123");
        JwtAuthResponse authResponse = authService.login(loginRequest);

        ChangePasswordRequest changeRequest = new ChangePasswordRequest(
                "WrongOldPassword",
                "NewPassword@456",
                "NewPassword@456"
        );

        Assertions.assertThrows(BadRequestException.class, () -> {
            authService.changePassword(authResponse.getUserId(), changeRequest);
        });
    }

    @Test
    public void testPasswordChange_SuccessWithValidCurrentPassword() {
        LoginRequest loginRequest = new LoginRequest("student01", "Student@123");
        JwtAuthResponse authResponse = authService.login(loginRequest);

        ChangePasswordRequest changeRequest = new ChangePasswordRequest(
                "Student@123",
                "NewPassword@456",
                "NewPassword@456"
        );

        Assertions.assertDoesNotThrow(() -> {
            authService.changePassword(authResponse.getUserId(), changeRequest);
        });

        // Verify login with new password works
        LoginRequest newLoginRequest = new LoginRequest("student01", "NewPassword@456");
        JwtAuthResponse newAuthResponse = authService.login(newLoginRequest);
        Assertions.assertNotNull(newAuthResponse.getAccessToken());
    }
}
