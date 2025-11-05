package com.project.ecom.controller;

import com.project.ecom.configuration.AppConstants;
import com.project.ecom.payload.ProductDTO;
import com.project.ecom.payload.ProductRequest;
import com.project.ecom.payload.ProductResponse;
import com.project.ecom.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequestMapping("api/")
@RestController
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping("/admin/category/{categoryId}/product")
    public ResponseEntity<ProductDTO> addProduct(
            @PathVariable Long categoryId,
            @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        ProductDTO saved = productService.addProduct(categoryId, productRequest, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getProducts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCT_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR) String sortOrder,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "brandId", required = false) Long brandId,
            @RequestParam(name = "keyword", required = false) String keyword,
            Authentication authentication
    ) {
        ProductResponse response = productService.getProducts( authentication, pageNumber, pageSize, sortBy, sortOrder, categoryId, brandId, keyword );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/admin/trash/products")
    public ResponseEntity<ProductResponse> getProductsInTrash(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCT_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "brandId", required = false) Long brandId,
            @RequestParam(name = "keyword", required = false) String keyword
    ){
        ProductResponse productResponse = productService.getProductsInTrash( pageNumber, pageSize, sortBy, sortOrder, categoryId, brandId, keyword );
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }


    @PutMapping("/admin/product/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long productId,
            @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        ProductDTO updated = productService.updateProduct(productId, productRequest, images);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/products")
    public ResponseEntity<List<ProductDTO>> deleteProducts(@RequestBody List<Long> productIds){
        List<ProductDTO> products = productService.deleteProducts(productIds);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
    @DeleteMapping("/admin/soft/products")
    public ResponseEntity<List<ProductDTO>> softDeleteProducts(@RequestBody List<Long> productIds){
        List<ProductDTO> products = productService.softDeleteProducts(productIds);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping("/admin/restore/products")
    public ResponseEntity<List<ProductDTO>> restoreProducts(@RequestBody List<Long> productIds){
        List<ProductDTO> restoreProducts = productService.restoreProducts(productIds);
        return new ResponseEntity<>(restoreProducts, HttpStatus.OK);
    }

    @PatchMapping("/admin/product/{productId}/status")
    public ResponseEntity<ProductDTO> updateProductStatus(
            @PathVariable Long productId,
            @RequestParam boolean active) {
        ProductDTO productDTO = productService.updateProductStatus(productId, active);
        return new ResponseEntity<>(productDTO, HttpStatus.OK);
    }

}
