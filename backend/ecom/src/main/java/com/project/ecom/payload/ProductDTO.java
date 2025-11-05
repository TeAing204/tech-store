package com.project.ecom.payload;

import com.project.ecom.model.ProductImage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    @NotBlank
    @Size(min = 5, message = "Tên sản phẩm phải chứa ít nhất 5 ký tự")
    private String productName;
    private String image;
    private String description;
    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;
    private boolean isActive;
    private CategoryDTO categoryDTO;
    private Long brandId;
    private BrandDTO brandDTO;
    private List<ImageProductDTO> images = new ArrayList<>();
}
