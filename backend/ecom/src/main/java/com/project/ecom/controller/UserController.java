package com.project.ecom.controller;

import com.project.ecom.configuration.AppConstants;
import com.project.ecom.model.UserStatus;
import com.project.ecom.payload.PasswordResetRequest;
import com.project.ecom.payload.ProductDTO;
import com.project.ecom.payload.UserDTO;
import com.project.ecom.payload.UserResponse;
import com.project.ecom.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/admin/sellers")
    public ResponseEntity<UserResponse> getSellers(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USER_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR) String sortOrder,
            @RequestParam(name = "roleId", required = false) Long roleId,
            @RequestParam(name = "status", required = false) UserStatus status,
            @RequestParam(name = "keyword", required = false) String keyword
    ){
        UserResponse userResponse = userService.getSellers(pageNumber, pageSize, sortBy, sortOrder, roleId, status, keyword);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @GetMapping("/admin/sellers/trash")
    public ResponseEntity<UserResponse> getTrashSellers(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USER_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR) String sortOrder,
            @RequestParam(name = "roleId", required = false) Long roleId,
            @RequestParam(name = "keyword", required = false) String keyword
    ){
        UserResponse userResponse = userService.getTrashSellers(pageNumber, pageSize, sortBy, sortOrder, roleId, keyword);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PutMapping("/admin/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long userId, @RequestPart("user") UserDTO userDTO, @RequestPart(value = "image", required = false) MultipartFile image
            ) throws IOException {
        UserDTO updatedUser = userService.updateUser(userId, userDTO, image);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PutMapping("/account")
    public ResponseEntity<UserDTO> updateAccount(@RequestBody UserDTO userDTO){
        UserDTO updatedAccount = userService.updateAccount(userDTO);
        return new ResponseEntity<>(updatedAccount, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/user/{userId}/status")
    public ResponseEntity<UserDTO> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam String status) {
        UserDTO userDTO = userService.updateUserStatus(userId, status);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/soft/users")
    public ResponseEntity<List<UserDTO>> softDeleteUser(@RequestBody List<Long> userIds){
        List<UserDTO> users = userService.softDeleteUsers(userIds);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/users")
    public ResponseEntity<List<UserDTO>> deleteUser(@RequestBody List<Long> userIds){
        List<UserDTO> users = userService.deleteUsers(userIds);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping("/admin/restore/users")
    public ResponseEntity<List<UserDTO>> restoreUsers(@RequestBody List<Long> userIds) {
        List<UserDTO> restoredUsers = userService.restoreUsers(userIds);
        return new ResponseEntity<>(restoredUsers, HttpStatus.OK);
    }
    @PostMapping("/admin/user/{userId}/image")
    public ResponseEntity<UserDTO> updateUserImage(@PathVariable Long userId, @RequestParam("image") MultipartFile image) throws Exception {
        UserDTO userDTO = userService.updateUserImage(userId, image);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }
    @PostMapping("account/image")
    public ResponseEntity<UserDTO> updateAccountImage(@RequestParam("image") MultipartFile image) throws IOException {
        UserDTO userDTO = userService.updateAccountImage(image);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }
    @GetMapping("/admin/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId){
        UserDTO userDTO = userService.getUserById(userId);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/users/{userId}/reset-password")
    public ResponseEntity<String> resetAdminPassword(
            @PathVariable Long userId,
            @Valid @RequestBody PasswordResetRequest request,
            Authentication authentication) {
        userService.resetAdminPassword(userId, request.getNewPassword(), authentication);
        return ResponseEntity.ok("Reset mật khẩu quản trị viên thành công");
    }
}
