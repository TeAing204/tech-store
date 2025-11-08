package com.project.ecom.service;
//
//import com.project.ecom.exception.APIException;
//import com.project.ecom.model.AppRole;
//import com.project.ecom.model.Role;
//import com.project.ecom.model.User;
//import com.project.ecom.payload.PasswordUpdateRequest;
//import com.project.ecom.payload.UserDTO;
//import com.project.ecom.repository.RoleRepository;
//import com.project.ecom.repository.UserRepository;
//import com.project.ecom.security.jwt.JwtUtils;
//import com.project.ecom.security.request.LoginRequest;
//import com.project.ecom.security.request.SignUpRequest;
//import com.project.ecom.security.response.MessageResponse;
//import com.project.ecom.security.response.UserInfoResponse;
//import com.project.ecom.security.service.UserDetailsImpl;
//import com.project.ecom.util.AuthUtil;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseCookie;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Service
//public class AuthServiceImpl implements AuthService{
//    @Autowired
//    private AuthenticationManager authenticationManager;
//    @Autowired
//    private ModelMapper modelMapper;
//    @Autowired
//    private JwtUtils jwtUtils;
//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private RoleRepository roleRepository;
//    @Autowired
//    private PasswordEncoder encoder;
//    @Autowired
//    private AuthUtil authUtil;
//    @Value("${image.base.url}")
//    private String imageBaseUrl;
//
//    @Override
//    public UserInfoResponse authenticate(LoginRequest loginRequest) {
//        Authentication authentication;
//        try {
//            authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            loginRequest.getUsername(), loginRequest.getPassword()
//                    )
//            );
//        } catch (AuthenticationException e) {
//            throw new RuntimeException("Bad credentials");
//        }
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
//
//        List<String> roles = userDetails.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .toList();
//
//        return new UserInfoResponse(
//                userDetails.getId(),
//                jwtCookie.getValue(),
//                userDetails.getUsername(),
//                userDetails.getEmail(),
//                roles
//        );
//    }
//
//    @Override
//    public MessageResponse register(SignUpRequest signUpRequest) {
//        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//            return new MessageResponse("Lỗi: tên người dùng đã tồn tại");
//        }
//        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//            return new MessageResponse("Lỗi: email đã tồn tại");
//        }
//        if (userRepository.existsByPhoneNumber(signUpRequest.getPhoneNumber())) {
//            return new MessageResponse("Lỗi: số điện thoại đã tồn tại");
//        }
//
//        User user = new User(
//                signUpRequest.getUsername(),
//                signUpRequest.getEmail(),
//                signUpRequest.getPhoneNumber(),
//                encoder.encode(signUpRequest.getPassword())
//        );
//
//        Set<Role> roles = resolveRoles(signUpRequest.getRoles());
//        user.setRoles(roles);
//        userRepository.save(user);
//
//        return new MessageResponse("Đăng ký tài khoản thành công");
//    }
//
//    private Set<Role> resolveRoles(Set<String> strRoles) {
//        Set<Role> roles = new HashSet<>();
//        if (strRoles == null) {
//            roles.add(roleRepository.findByRoleName(AppRole.ROLE_USER)
//                    .orElseThrow(() -> new RuntimeException("Lỗi: role không tồn tại!")));
//        } else {
//            strRoles.forEach(role -> {
//                switch (role) {
//                    case "manager" -> roles.add(roleRepository.findByRoleName(AppRole.ROLE_MANAGER)
//                            .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!")));
//                    case "admin" -> roles.add(roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
//                            .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!")));
//                    default -> roles.add(roleRepository.findByRoleName(AppRole.ROLE_USER)
//                            .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!")));
//                }
//            });
//        }
//        return roles;
//    }
//
//    @Override
//    public UserInfoResponse getCurrentUser() {
//        User user = authUtil.loggedInUser();
//        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(UserDetailsImpl.build(user));
//
//        List<String> roles = user.getRoles().stream()
//                .map(role -> role.getRoleName().name())
//                .collect(Collectors.toList());
//
//        return new UserInfoResponse(
//                user.getUserId(),
//                jwtCookie.getValue(),
//                constructImageUrl(user.getAvatar()),
//                user.getUsername(),
//                user.getEmail(),
//                user.getPhoneNumber(),
//                roles
//        );
//    }
//
//    @Override
//    public MessageResponse signout() {
//        ResponseCookie cookie = jwtUtils.getCleanCookie();
//        return new MessageResponse("Bạn đã đăng xuất");
//    }
//
//    @Override
//    public UserDTO updatePassword(PasswordUpdateRequest request) {
//        User user = (User) userRepository.findByEmail(authUtil.loggedInEmail())
//                .orElseThrow(() -> new APIException("Người dùng hiện tại không tồn tại"));
//        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
//            throw new APIException("Mật khẩu hiện tại không đúng");
//        }
//        user.setPassword(encoder.encode(request.getNewPassword()));
//        User savedUser = userRepository.save(user);
//        return modelMapper.map(savedUser, UserDTO.class);
//    }
//
//    private String constructImageUrl(String imageName) {
//        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
//    }
//}


//package com.project.ecom.service;
//
//import com.project.ecom.exception.APIException;
//import com.project.ecom.model.AppRole;
//import com.project.ecom.model.Role;
//import com.project.ecom.model.User;
//import com.project.ecom.payload.PasswordUpdateRequest;
//import com.project.ecom.payload.UserDTO;
//import com.project.ecom.repository.RoleRepository;
//import com.project.ecom.repository.UserRepository;
//import com.project.ecom.security.jwt.JwtUtils;
//import com.project.ecom.security.request.LoginRequest;
//import com.project.ecom.security.request.SignUpRequest;
//import com.project.ecom.security.response.MessageResponse;
//import com.project.ecom.security.response.UserInfoResponse;
//import com.project.ecom.security.service.UserDetailsImpl;
//import com.project.ecom.util.AuthUtil;
//import jakarta.transaction.Transactional;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.ResponseCookie;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//import java.util.stream.Collectors;

//@Service
//@Transactional
//public class AuthServiceImpl implements AuthService {
//    @Autowired
//    private ModelMapper modelMapper;
//    @Autowired
//    private AuthenticationManager authenticationManager;
//    @Autowired
//    private JwtUtils jwtUtils;
//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private RoleRepository roleRepository;
//    @Autowired
//    private PasswordEncoder encoder;
//    @Autowired
//    private AuthUtil authUtil;
//    @Value("${image.base.url}")
//    private String imageBaseUrl;
//
//    @Override
//    public UserInfoResponse authenticate(LoginRequest loginRequest) {
//        Authentication authentication;
//        try {
//            authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            loginRequest.getUsername(), loginRequest.getPassword()
//                    )
//            );
//        } catch (AuthenticationException e) {
//            throw new RuntimeException("Bad credentials");
//        }
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
//
//        List<String> roles = userDetails.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .toList();
//
//        return new UserInfoResponse(
//                userDetails.getId(),
//                jwtCookie.getValue(),
//                userDetails.getUsername(),
//                userDetails.getEmail(),
//                roles
//        );
//    }
//
//    @Override
//    public MessageResponse register(SignUpRequest signUpRequest) {
//        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//            return new MessageResponse("Lỗi: tên người dùng đã tồn tại");
//        }
//        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//            return new MessageResponse("Lỗi: email đã tồn tại");
//        }
//        if (userRepository.existsByPhoneNumber(signUpRequest.getPhoneNumber())) {
//            return new MessageResponse("Lỗi: số điện thoại đã tồn tại");
//        }
//
//        User user = new User(
//                signUpRequest.getUsername(),
//                signUpRequest.getEmail(),
//                signUpRequest.getPhoneNumber(),
//                encoder.encode(signUpRequest.getPassword())
//        );
//
//        Set<Role> roles = resolveRoles(signUpRequest.getRoles());
//        user.setRoles(roles);
//        userRepository.save(user);
//
//        return new MessageResponse("Đăng ký tài khoản thành công");
//    }
//
//    private Set<Role> resolveRoles(Set<String> strRoles) {
//        Set<Role> roles = new HashSet<>();
//        if (strRoles == null) {
//            roles.add(roleRepository.findByRoleName(AppRole.ROLE_USER)
//                    .orElseThrow(() -> new RuntimeException("Lỗi: role không tồn tại!")));
//        } else {
//            strRoles.forEach(role -> {
//                switch (role) {
//                    case "manager" -> roles.add(roleRepository.findByRoleName(AppRole.ROLE_MANAGER)
//                            .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!")));
//                    case "admin" -> roles.add(roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
//                            .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!")));
//                    default -> roles.add(roleRepository.findByRoleName(AppRole.ROLE_USER)
//                            .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!")));
//                }
//            });
//        }
//        return roles;
//    }
//
//    @Override
//    public UserInfoResponse getCurrentUser() {
//        User user = authUtil.loggedInUser();
//        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(UserDetailsImpl.build(user));
//
//        List<String> roles = user.getRoles().stream()
//                .map(role -> role.getRoleName().name())
//                .collect(Collectors.toList());
//
//        return new UserInfoResponse(
//                user.getUserId(),
//                jwtCookie.getValue(),
//                constructImageUrl(user.getAvatar()),
//                user.getUsername(),
//                user.getEmail(),
//                user.getPhoneNumber(),
//                roles
//        );
//    }
//
//    @Override
//    public UserDTO updatePassword(PasswordUpdateRequest request) {
//        User user = (User) userRepository.findByEmail(authUtil.loggedInEmail())
//                .orElseThrow(() -> new APIException("Người dùng hiện tại không tồn tại"));
//        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
//            throw new APIException("Mật khẩu hiện tại không đúng");
//        }
//        user.setPassword(encoder.encode(request.getNewPassword()));
//        User savedUser = userRepository.save(user);
//        return modelMapper.map(savedUser, UserDTO.class);
//    }
//
//    @Override
//    public MessageResponse signout() {
//        ResponseCookie cookie = jwtUtils.getCleanCookie();
//        return new MessageResponse("Bạn đã đăng xuất");
//    }
//        private String constructImageUrl(String imageName) {
//        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
//    }
//}

import com.project.ecom.exception.APIException;
import com.project.ecom.model.AppRole;
import com.project.ecom.model.Role;
import com.project.ecom.model.User;
import com.project.ecom.payload.PasswordUpdateRequest;
import com.project.ecom.payload.UserDTO;
import com.project.ecom.repository.RoleRepository;
import com.project.ecom.repository.UserRepository;
import com.project.ecom.security.jwt.JwtUtils;
import com.project.ecom.security.request.LoginRequest;
import com.project.ecom.security.request.SignUpRequest;
import com.project.ecom.security.response.MessageResponse;
import com.project.ecom.security.response.UserInfoResponse;
import com.project.ecom.security.service.UserDetailsImpl;
import com.project.ecom.service.AuthService;
import com.project.ecom.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthUtil authUtil;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Value("${image.base.url}")
    private String imageBaseUrl;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ResponseEntity<?> authenticateUser(LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
        } catch (AuthenticationException ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Sai tài khoản hoặc mật khẩu");
            error.put("status", false);
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(role -> role.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(
                userDetails.getId(),
                jwtCookie.getValue(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(response);
    }

    @Override
    public ResponseEntity<MessageResponse> registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Tên người dùng đã tồn tại"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email đã tồn tại"));
        }
        if (userRepository.existsByPhoneNumber(signUpRequest.getPhoneNumber())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Số điện thoại đã tồn tại"));
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getPhoneNumber(),
                encoder.encode(signUpRequest.getPassword())
        );

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Role không tồn tại"));
            roles.add(userRole);
        } else {
            for (String role : strRoles) {
                AppRole appRole = switch (role.toLowerCase()) {
                    case "admin" -> AppRole.ROLE_ADMIN;
                    case "manager" -> AppRole.ROLE_MANAGER;
                    default -> AppRole.ROLE_USER;
                };
                Role foundRole = roleRepository.findByRoleName(appRole)
                        .orElseThrow(() -> new RuntimeException("Role không tồn tại"));
                roles.add(foundRole);
            }
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Đăng ký tài khoản thành công"));
    }

    @Override
    public ResponseEntity<UserInfoResponse> getUserDetails() {
        User user = authUtil.loggedInUser();
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(UserDetailsImpl.build(user));

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(
                user.getUserId(),
                jwtCookie.getValue(),
                constructImageUrl(user.getAvatar()),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                roles
        );

        return ResponseEntity.ok(response);
    }

    @Override
    public String getCurrentUsername() {
        return Optional.ofNullable(authUtil.loggedInUser())
                .map(User::getUsername)
                .orElse("");
    }

    @Override
    public ResponseEntity<MessageResponse> signoutUser() {
        ResponseCookie cookie = jwtUtils.getCleanCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("Bạn đã đăng xuất"));
    }

        private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }
    @Override
    public UserDTO updatePassword(PasswordUpdateRequest request) {
        User user = userRepository.findByEmail(authUtil.loggedInEmail())
                .orElseThrow(() -> new APIException("Người dùng hiện tại không tồn tại"));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new APIException("Mật khẩu hiện tại không đúng");
        }

        if (request.getNewPassword().equals(request.getOldPassword())) {
            throw new APIException("Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Ghi log hành động (tùy bạn có muốn log hay không)
        System.out.println("User ID " + user.getUserId() + " đã đổi mật khẩu vào " + LocalDateTime.now());

        // Sau khi đổi mật khẩu, nên yêu cầu đăng nhập lại
        SecurityContextHolder.clearContext();

        return modelMapper.map(user, UserDTO.class);
    }
}
