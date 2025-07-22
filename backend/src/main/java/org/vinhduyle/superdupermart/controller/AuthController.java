package org.vinhduyle.superdupermart.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.vinhduyle.superdupermart.domain.User;
import org.vinhduyle.superdupermart.dto.LoginRequest;
import org.vinhduyle.superdupermart.dto.RegistrationRequest;
import org.vinhduyle.superdupermart.dto.UserResponse;
import org.vinhduyle.superdupermart.service.UserService;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegistrationRequest request) {
        // No need for BindingResult parameter or manual check here.
        // If validation fails, Spring will throw MethodArgumentNotValidException,
        // and your GlobalExceptionHandler will catch it.
        User user = userService.registerUser(request);
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request) {
        // No need for BindingResult parameter or manual check here.
        // If validation fails, Spring will throw MethodArgumentNotValidException,
        // and your GlobalExceptionHandler will catch it.
        String token = userService.loginAndGetToken(request);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

}
