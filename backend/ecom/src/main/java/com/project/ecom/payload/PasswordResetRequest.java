package com.project.ecom.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequest {
    @NotBlank
    @Size(min = 5, message = "Mật khẩu tối thiểu chứa 5 ký tự")
    private String newPassword;
}
