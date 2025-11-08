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
import com.project.ecom.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private AuthUtil authUtil;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private FileService fileService;
    @Value("${project.image}")
    private String path;
    @Autowired
    private PasswordEncoder encoder;
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
        List<UserDTO> userDTOS = users.stream().map(user -> {
            UserDTO dto = modelMapper.map(user, UserDTO.class);
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                dto.setAvatar(constructImageUrl(user.getAvatar()));
            }
            return dto;
        }).toList();
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
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            userDTO.setAvatar(constructImageUrl(user.getAvatar()));
        }
        return userDTO;
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
//        List<UserDTO> userDTOS = users.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
        List<UserDTO> userDTOS = users.stream().map(user -> {
            UserDTO dto = modelMapper.map(user, UserDTO.class);
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                dto.setAvatar(constructImageUrl(user.getAvatar()));
            }
            return dto;
        }).toList();
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
//        List<UserDTO> userDTOS = users.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
        List<UserDTO> userDTOS = users.stream().map(user -> {
            UserDTO dto = modelMapper.map(user, UserDTO.class);
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                dto.setAvatar(constructImageUrl(user.getAvatar()));
            }
            return dto;
        }).toList();
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
            user.setAvatar(constructImageUrl(fileName));
        }

        User savedUser = userRepository.save(user);

        UserDTO dto = modelMapper.map(savedUser, UserDTO.class);
        dto.setAvatar(constructImageUrl(savedUser.getAvatar()));
        return dto;
    }

    @Override
    public UserDTO updateUserImage(Long userId, MultipartFile image) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", userId));
        String fileName = fileService.uploadImage(path, image);
        user.setAvatar(constructImageUrl(fileName));
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", userId));
        UserDTO dto = modelMapper.map(user, UserDTO.class);
        // Xử lý ảnh đại diện
        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            dto.setAvatar(constructImageUrl(user.getAvatar()));
        }
        return dto;
    }

    @Override
    public void resetAdminPassword(Long userId, String newPassword, Authentication authentication) {
        // Lấy người thực hiện hành động
        User currentUser = userRepository.findByEmail(authUtil.loggedInEmail())
                .orElseThrow(() -> new APIException("Người dùng hiện tại không tồn tại"));

        // Lấy người bị reset mật khẩu
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new APIException("Không tìm thấy quản trị viên có ID: " + userId));
        // Lấy role hiện tại và role của người bị reset
        String currentRole = currentUser.getRoles()
                .stream()
                .findFirst()
                .map(role -> role.getRoleName().name())
                .orElse("UNKNOWN");

        String targetRole = targetUser.getRoles()
                .stream()
                .findFirst()
                .map(role -> role.getRoleName().name())
                .orElse("UNKNOWN");
        // Chỉ admin cấp cao mới có quyền reset
        if (!"ROLE_ADMIN".equals(currentRole)) {
            throw new APIException("Bạn không có quyền reset mật khẩu cho người khác");
        }
        // Không thể tự reset mật khẩu
        if (currentUser.getUserId().equals(targetUser.getUserId())) {
            throw new APIException("Không thể tự reset mật khẩu của chính mình");
        }
        // Không reset cho user thường
        if ("ROLE_USER".equals(targetRole)) {
            throw new APIException("Không thể reset mật khẩu cho người dùng thông thường");
        }
        // Mã hóa và lưu mật khẩu mới
        targetUser.setPassword(encoder.encode(newPassword));
        userRepository.save(targetUser);
    }

//    @Override
//    public UserDTO updateAccount(UserDTO userDTO) {
//        User user = userRepository.findByEmail(authUtil.loggedInEmail())
//                .orElseThrow(() -> new APIException("Người dùng hiện tại không tồn tại"));
//
//        if (userDTO.getUsername() != null && !userDTO.getUsername().isBlank()) {
//            user.setUsername(userDTO.getUsername());
//        }
//
//        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
//            user.setEmail(userDTO.getEmail());
//        }
//
//        if (userDTO.getPhoneNumber() != null && !userDTO.getPhoneNumber().isBlank()) {
//            user.setPhoneNumber(userDTO.getPhoneNumber());
//        }
//        User savedUser = userRepository.save(user);
//        return modelMapper.map(savedUser, UserDTO.class);
//    }
    @Override
    public UserDTO updateAccount(UserDTO userDTO) {
        User user = userRepository.findByEmail(authUtil.loggedInEmail())
                .orElseThrow(() -> new APIException("Người dùng hiện tại không tồn tại"));

        // Cập nhật username nếu có và khác giá trị cũ
        if (userDTO.getUsername() != null && !userDTO.getUsername().isBlank()) {
            if (userRepository.existsByUsername(userDTO.getUsername())
                    && !userDTO.getUsername().equals(user.getUsername())) {
                throw new APIException("Tên người dùng đã tồn tại");
            }
            user.setUsername(userDTO.getUsername());
        }

        // Cập nhật email nếu có và khác giá trị cũ
        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
            if (userRepository.existsByEmail(userDTO.getEmail())
                    && !userDTO.getEmail().equals(user.getEmail())) {
                throw new APIException("Email đã tồn tại");
            }
            user.setEmail(userDTO.getEmail());
        }

        // Cập nhật số điện thoại nếu có và khác giá trị cũ
        if (userDTO.getPhoneNumber() != null && !userDTO.getPhoneNumber().isBlank()) {
            if (userRepository.existsByPhoneNumber(userDTO.getPhoneNumber())
                    && !userDTO.getPhoneNumber().equals(user.getPhoneNumber())) {
                throw new APIException("Số điện thoại đã tồn tại");
            }
            user.setPhoneNumber(userDTO.getPhoneNumber());
        }

        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }


    @Override
    public UserDTO updateAccountImage(MultipartFile image) throws IOException {
        User user = userRepository.findByEmail(authUtil.loggedInEmail())
                .orElseThrow(() -> new APIException("Người dùng hiện tại không tồn tại"));
        String fileName = fileService.uploadImage(path, image);
        user.setAvatar(fileName);
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }


    private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }
}
