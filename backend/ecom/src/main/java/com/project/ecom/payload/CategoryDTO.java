package com.project.ecom.payload;

import com.project.ecom.model.CategoryStatus;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long categoryId;

    @NotBlank
    @Size(min = 5, message = "Tên danh mục chứa ít nhất 5 ký tự")
    private String categoryName;
    private String description;
    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;
    private CategoryStatus status;
    private Long totalProducts;
}
