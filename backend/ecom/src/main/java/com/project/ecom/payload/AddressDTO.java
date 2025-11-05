package com.project.ecom.payload;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private Long addressId;
    @NotBlank
    private String buildingName;
    @NotBlank
    private String street;
    @NotBlank
    private String country;
    @NotBlank
    private String status;
}
