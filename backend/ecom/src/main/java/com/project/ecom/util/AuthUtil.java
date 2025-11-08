package com.project.ecom.util;
//
//import com.project.ecom.model.User;
//import com.project.ecom.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Component;
//
//@Component
//public class AuthUtil {
//    @Autowired
//    private UserRepository userRepository;
//
////    public String loggedInEmail(){
////        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
////        User user = userRepository.findByUsername(authentication.getName())
////                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + authentication.getName()));
////        return user.getEmail();
////    }
////    public Long loggedInUserId(){
////        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
////        User user = userRepository.findByUsername(authentication.getName())
////                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + authentication.getName()));
////        return user.getUserId();
////    }
////    public User loggedInUser(){
////        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
////        User user = userRepository.findByUsername(authentication.getName())
////                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + authentication.getName()));
////        return user;
////    }
//    public String loggedInEmail(){
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        Long userId = Long.valueOf(authentication.getName()); // lấy từ JWT
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user với id: " + userId));
//        return user.getEmail();
//    }
//
//    public Long loggedInUserId(){
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        return Long.valueOf(authentication.getName()); // trực tiếp lấy userId từ token
//    }
//    public User loggedInUser(){
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        Long userId = Long.valueOf(authentication.getName()); // nếu claim là userId
//        return userRepository.findById(userId)
//                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user với id: " + userId));
//    }
//
//}
//package com.project.ecom.security.util;

import com.project.ecom.model.User;
import com.project.ecom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {
    @Autowired
    private UserRepository userRepository;

    public String loggedInEmail(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.valueOf(authentication.getName()); // lấy userId từ JWT
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + userId));
        return user.getEmail();
    }

    public Long loggedInUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return Long.valueOf(authentication.getName()); // trực tiếp lấy userId từ token
    }

    public User loggedInUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.valueOf(authentication.getName());
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + userId));
    }
}
