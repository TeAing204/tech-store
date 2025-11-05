package com.project.ecom.payload;

import com.project.ecom.model.Cart;
import com.project.ecom.model.Role;
import com.project.ecom.model.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    @NotBlank
    @Size(max = 20)
    private String username;
    @NotBlank
    @Size(max = 50)
    private String email;
    private String avatar;
    private String phoneNumber;
    private UserStatus status;
    private LocalDateTime deleteAt;

    private Set<Role> roles = new HashSet<>();
    private List<AddressDTO> addresses;
    private Cart cart;
}
