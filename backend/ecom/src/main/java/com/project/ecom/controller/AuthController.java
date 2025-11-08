//package com.project.ecom.controller;
//
//import com.project.ecom.model.AppRole;
//import com.project.ecom.model.Role;
//import com.project.ecom.model.User;
//import com.project.ecom.payload.PasswordResetRequest;
//import com.project.ecom.payload.PasswordUpdateRequest;
//import com.project.ecom.payload.UserDTO;
//import com.project.ecom.repository.RoleRepository;
//import com.project.ecom.security.jwt.JwtUtils;
//import com.project.ecom.security.request.LoginRequest;
//import com.project.ecom.security.request.SignUpRequest;
//import com.project.ecom.security.response.MessageResponse;
//import com.project.ecom.security.response.UserInfoResponse;
//import com.project.ecom.security.service.UserDetailsImpl;
//import com.project.ecom.repository.UserRepository;
//import com.project.ecom.service.AuthService;
//import com.project.ecom.util.AuthUtil;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseCookie;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//    @Autowired
//    private AuthUtil authUtil;
//    @Autowired
//    private JwtUtils jwtUtils;
//    @Autowired
//    private AuthenticationManager authenticationManager;
//    @Autowired
//    private PasswordEncoder encoder;
//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private RoleRepository roleRepository;
//
//    @PostMapping("/signin")
//    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest){
//        Authentication authentication;
//        try {
//            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
//                    loginRequest.getUsername(), loginRequest.getPassword()
//            ));
//        } catch (AuthenticationException exception){
//            Map<String, Object> map = new HashMap<>();
//            map.put("message", "Bad credentials");
//            map.put("status", false);
//            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
//        }
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
//        List<String> roles = userDetails.getAuthorities().stream()
//                .map(GrantedAuthority::getAuthority)
//                .toList();
//        UserInfoResponse response = new UserInfoResponse(userDetails.getId(), jwtCookie.getValue(), userDetails.getUsername(), userDetails.getEmail(), roles);
//        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).body(response);
//    }
//
//    @GetMapping("/user")
//    public ResponseEntity<UserInfoResponse> getUserDetails() {
//        User user = authUtil.loggedInUser(); // Lấy user từ SecurityContextHolder
//        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(UserDetailsImpl.build(user));
//
//        List<String> roles = user.getRoles().stream()
//                .map(role -> role.getRoleName().name())
//                .toList();
//
//        UserInfoResponse response = new UserInfoResponse(
//                user.getUserId(),
//                jwtCookie.getValue(),
//                user.getAvatar(),
//                user.getUsername(),
//                user.getEmail(),
//                user.getPhoneNumber(),
//                roles
//        );
//
//        return ResponseEntity.ok().body(response);
//    }
//
//    @GetMapping("/username")
//    public String currentUsername(Authentication authentication){
//        if(authentication != null){
//            return authentication.getName();
//        }
//        else return "";
//    }
//
//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest){
//        if(userRepository.existsByUsername(signUpRequest.getUsername())){
//            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: tên người dùng đã tồn tại"));
//        }
//        if(userRepository.existsByEmail(signUpRequest.getEmail())){
//            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: email đã tồn tại"));
//        }
//        if(userRepository.existsByPhoneNumber(signUpRequest.getPhoneNumber())){
//            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: số điện thoại đã tồn tại"));
//        }
//        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), signUpRequest.getPhoneNumber(), encoder.encode(signUpRequest.getPassword()));
//
//        Set<String> strRoles = signUpRequest.getRoles();
//        Set<Role> roles = new HashSet<>();
//        if(strRoles == null){
//            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
//                    .orElseThrow(() -> new RuntimeException("Lỗi: role không tồn tại!"));
//            roles.add(userRole);
//        } else {
//            strRoles.forEach(role -> {
//                switch (role){
//                    case "manager":
//                        Role superadminRole = roleRepository.findByRoleName(AppRole.ROLE_MANAGER)
//                                .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!"));
//                        roles.add(superadminRole);
//                        break;
//                    case "admin":
//                        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
//                                .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!"));
//                        roles.add(adminRole);
//                        break;
//                    default:
//                        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
//                                .orElseThrow(() -> new RuntimeException("Lỗi: Role không tồn tại!"));
//                        roles.add(userRole);
//                }
//            });
//        }
//        user.setRoles(roles);
//        userRepository.save(user);
//        return ResponseEntity.ok(new MessageResponse("Đăng ký tài khoản thành công"));
//    }
//    @PostMapping("/signout")
//    public ResponseEntity<?> signoutUser(){
//        ResponseCookie cookie = jwtUtils.getCleanCookie();
//        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new MessageResponse("Bạn đã đăng xuất"));
//    }
//}


//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//    @Autowired
//    private JwtUtils jwtUtils;
//    @Autowired
//    private AuthService authService;
//
//    @PostMapping("/signin")
//    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
//        try {
//            UserInfoResponse response = authService.authenticate(loginRequest);
//
//            // Tạo cookie từ token trong response
//            ResponseCookie jwtCookie = ResponseCookie.from("ecomjwt", response.getJwtToken())
//                    .path("/")
//                    .maxAge(7 * 24 * 60 * 60) // tuỳ theo jwtExpirationMs
//                    .httpOnly(true)
//                    .secure(false) // bật true nếu HTTPS
//                    .build();
//
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
//                    .body(response);
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new MessageResponse("Bad credentials"));
//        }
//    }
//
//
//
//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
//        MessageResponse response = authService.register(signUpRequest);
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/user")
//    public ResponseEntity<UserInfoResponse> getUserDetails() {
//        return ResponseEntity.ok(authService.getCurrentUser());
//    }
//
//    @PostMapping("/signout")
//    public ResponseEntity<?> signoutUser() {
//        return ResponseEntity.ok(authService.signout());
//    }
//
////    @PostMapping("/update-password")
////    public ResponseEntity<UserDTO> updatePassword(@RequestBody PasswordUpdateRequest request) {
////        UserDTO userDTO = authService.updatePassword(request);
//////        ResponseCookie cleanCookie = jwtUtils.getCleanCookie();
//////        return ResponseEntity.ok()
//////                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
//////                .body(userDTO);
////        return new ResponseEntity<>(userDTO, HttpStatus.OK);
////    }
//}








package com.project.ecom.controller;

import com.project.ecom.payload.PasswordUpdateRequest;
import com.project.ecom.payload.UserDTO;
import com.project.ecom.security.jwt.JwtUtils;
import com.project.ecom.security.request.LoginRequest;
import com.project.ecom.security.request.SignUpRequest;
import com.project.ecom.security.response.MessageResponse;
import com.project.ecom.security.response.UserInfoResponse;
import com.project.ecom.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        return authService.authenticateUser(loginRequest);
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@RequestBody SignUpRequest signUpRequest) {
        return authService.registerUser(signUpRequest);
    }

    @GetMapping("/user")
    public ResponseEntity<UserInfoResponse> getUserDetails() {
        return authService.getUserDetails();
    }

    @GetMapping("/username")
    public String currentUsername() {
        return authService.getCurrentUsername();
    }

    @PostMapping("/signout")
    public ResponseEntity<MessageResponse> signoutUser() {
        return authService.signoutUser();
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest request) {
        UserDTO userDTO = authService.updatePassword(request);

        // Làm sạch cookie JWT => ép đăng nhập lại
        ResponseCookie cleanCookie = jwtUtils.getCleanCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .body(Map.of(
                        "message", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
                        "user", userDTO
                ));
    }

}
