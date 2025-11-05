package com.project.ecom.security.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    @NotBlank
    @Size(min = 3)
    private String username;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min = 9, max = 11)
    private String phoneNumber;
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private Set<String> roles;
    @NotBlank
    @Size(min = 4)
    private String password;

}
