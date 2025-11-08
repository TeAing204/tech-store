
package com.project.ecom.service;

import com.project.ecom.payload.PasswordUpdateRequest;
import com.project.ecom.payload.UserDTO;
import com.project.ecom.security.request.LoginRequest;
import com.project.ecom.security.request.SignUpRequest;
import com.project.ecom.security.response.MessageResponse;
import com.project.ecom.security.response.UserInfoResponse;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> authenticateUser(LoginRequest loginRequest);
    ResponseEntity<MessageResponse> registerUser(SignUpRequest signUpRequest);
    ResponseEntity<UserInfoResponse> getUserDetails();
    String getCurrentUsername();
    ResponseEntity<MessageResponse> signoutUser();

    UserDTO updatePassword(PasswordUpdateRequest request);
}
