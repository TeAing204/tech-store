package com.project.ecom.security.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private Long id;
    private String jwtToken;
    private String avatar;
    private String username;
    private String email;
    private String phoneNumber;
    private List<String> roles;


    public UserInfoResponse(Long id, String jwtToken, String username, String email, List<String> roles) {
        this.id = id;
        this.jwtToken = jwtToken;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

}
