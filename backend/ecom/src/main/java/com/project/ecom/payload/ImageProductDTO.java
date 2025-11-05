package com.project.ecom.payload;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageProductDTO {
    private Long id;
    private String fileName;
    private String url;
}