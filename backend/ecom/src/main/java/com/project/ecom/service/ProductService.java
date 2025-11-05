package com.project.ecom.service;

import com.project.ecom.payload.ProductDTO;
import com.project.ecom.payload.ProductRequest;
import com.project.ecom.payload.ProductResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {

    ProductDTO addProduct(Long categoryId, ProductRequest req, List<MultipartFile> images) throws IOException;

    ProductDTO updateProduct(Long productId, ProductRequest req, List<MultipartFile> images) throws IOException;

//    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;

    ProductResponse getProductsInTrash(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long categoryId, Long brandId, String keyword);

    ProductResponse getProducts(Authentication authentication, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long categoryId, Long brandId, String keyword);

    ProductDTO updateProductStatus(Long productId, boolean active);

    List<ProductDTO> softDeleteProducts(List<Long> productIds);

    List<ProductDTO> deleteProducts(List<Long> productIds);

    List<ProductDTO> restoreProducts(List<Long> productIds);
}
