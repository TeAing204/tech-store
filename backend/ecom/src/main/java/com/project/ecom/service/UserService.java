package com.project.ecom.service;

import com.project.ecom.model.UserStatus;
import com.project.ecom.payload.UserDTO;
import com.project.ecom.payload.UserResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    UserResponse getSellers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long roleId, UserStatus status, String keyword);
    UserDTO updateUserStatus(Long userId, String status);

    List<UserDTO> softDeleteUsers(List<Long> userIds);

    UserResponse getTrashSellers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long roleId, String keyword);

    List<UserDTO> restoreUsers(List<Long> userIds);

    List<UserDTO> deleteUsers(List<Long> userIds);

    UserDTO updateUser(Long userId, UserDTO userDTO, MultipartFile image) throws IOException;

    UserDTO updateUserImage(Long userId, MultipartFile image) throws IOException;

    UserDTO getUserById(Long userId);

    void resetAdminPassword(Long userId, @NotBlank @Size(min = 5, message = "Mật khẩu tối thiểu chứa 5 ký tự") String newPassword, Authentication authentication);

    UserDTO updateAccount(UserDTO userDTO);

    UserDTO updateAccountImage(MultipartFile image) throws IOException;
}
