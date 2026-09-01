package com.academic.projectmonitoring.controller;

import com.academic.projectmonitoring.dto.request.ChangePasswordRequest;
import com.academic.projectmonitoring.dto.request.LoginRequest;
import com.academic.projectmonitoring.dto.response.ApiResponse;
import com.academic.projectmonitoring.dto.response.JwtAuthResponse;
import com.academic.projectmonitoring.dto.response.UserDto;
import com.academic.projectmonitoring.security.UserPrincipal;
import com.academic.projectmonitoring.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDto userDto = authService.getCurrentUserDto(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", userDto));
    }
}
