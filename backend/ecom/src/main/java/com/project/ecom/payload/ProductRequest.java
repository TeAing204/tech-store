package com.project.ecom.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    private String productName;
    private String description;
    private double price;
    private double discount;
    private Integer quantity;
    private Long categoryId;
    private Long brandId;

    private List<MultipartFile> images;
}