package com.project.ecom.service;

import com.project.ecom.exception.APIException;
import com.project.ecom.exception.ResourceNotFoundException;
import com.project.ecom.model.Role;
import com.project.ecom.model.User;
import com.project.ecom.model.UserStatus;
import com.project.ecom.payload.UserDTO;
import com.project.ecom.payload.UserResponse;
import com.project.ecom.repository.RoleRepository;
import com.project.ecom.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private FileService fileService;
    @Value("${project.image}")
    private String path;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    @Override
    public UserResponse getSellers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long roleId, UserStatus status, String keyword) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<User> userPage = userRepository.findAdminsAndManagers(roleId, status, keyword, pageDetails);
        List<User> users = userPage.getContent();
        if (users.isEmpty()){
            throw new APIException("Danh sách trống");
        }
        List<UserDTO> userDTOS = users.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
        UserResponse userResponse = new UserResponse();
        userResponse.setContent(userDTOS);
        userResponse.setPageNumber(userPage.getNumber());
        userResponse.setPageSize(userPage.getSize());
        userResponse.setTotalPages(userPage.getTotalPages());
        userResponse.setTotalElements(userPage.getTotalElements());
        userResponse.setLastPage(userPage.isLast());
        return userResponse;
    }

    @Override
    public UserDTO updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", userId));
        try {
            UserStatus newStatus = UserStatus.valueOf(status.trim().toUpperCase());
            user.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status);
        }

        userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public List<UserDTO> softDeleteUsers(List<Long> userIds) {
        List<User> users = userRepository.findAllById(userIds);
        for (User user : users) {
            if (user.getStatus() != UserStatus.PAUSED) {
                user.setStatus(UserStatus.PAUSED);
            }
            user.setDeleteAt(LocalDateTime.now());
        }
        userRepository.saveAll(users);
        List<UserDTO> userDTOS = users.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
        return userDTOS;
    }

    @Override
    public UserResponse getTrashSellers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long roleId, String keyword) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<User> userPage = userRepository.findDeletedAdminsAndManagers(roleId, keyword, pageDetails);
        List<User> users = userPage.getContent();
        if (users.isEmpty()){
            throw new APIException("Thùng rác trống");
        }
        List<UserDTO> userDTOS = users.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
        UserResponse userResponse = new UserResponse();
        userResponse.setContent(userDTOS);
        userResponse.setPageNumber(userPage.getNumber());
        userResponse.setPageSize(userPage.getSize());
        userResponse.setTotalPages(userPage.getTotalPages());
        userResponse.setTotalElements(userPage.getTotalElements());
        userResponse.setLastPage(userPage.isLast());
        return userResponse;
    }

    @Override
    public List<UserDTO> restoreUsers(List<Long> userIds) {
        List<User> users = userRepository.findAllById(userIds);
        for (User user : users) {
            user.setDeleteAt(null);
        }
        userRepository.saveAll(users);
        List<UserDTO> userDTOS = users.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
        return userDTOS;
    }

    @Override
    @Transactional
    public List<UserDTO> deleteUsers(List<Long> userIds) {
        List<User> users = userRepository.findAllById(userIds);
        List<UserDTO> dtos = users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .toList();
        userRepository.deleteAllByIdInBatch(userIds);
        return dtos;
    }

    @Override
    public UserDTO updateUser(Long userId, UserDTO userDTO, MultipartFile image) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", userId));

        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setStatus(userDTO.getStatus());

        if (image != null && !image.isEmpty()) {
            // Nếu user đã có ảnh cũ, xóa ảnh đó
            if (user.getAvatar() != null && !user.getAvatar().equals("default.png")) {
                try {
                    fileService.deleteImage(path, user.getAvatar());
                } catch (IOException e) {
                    // không throw lỗi upload, chỉ log (tránh fail toàn bộ)
                    System.err.println("Không thể xóa ảnh cũ: " + e.getMessage());
                }
            }

            String fileName = fileService.uploadImage(path, image);
            user.setAvatar(fileName);
        }

        User savedUser = userRepository.save(user);

        UserDTO dto = modelMapper.map(savedUser, UserDTO.class);
        dto.setAvatar(constructImageUrl(savedUser.getAvatar()));

        return dto;
    }

    private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }
}
