package com.project.ecom.controller;

import com.project.ecom.configuration.AppConstants;
import com.project.ecom.model.CategoryStatus;
import com.project.ecom.payload.CategoryDTO;
import com.project.ecom.payload.CategoryResponse;
import com.project.ecom.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/")
@RestController
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/public/categories")
    public ResponseEntity<CategoryResponse> getAllCategories(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_CATEGORY_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "status", required = false) CategoryStatus status,
            @RequestParam(name = "minProducts", required = false) Long minProducts,
            @RequestParam(name = "maxProducts", required = false) Long maxProducts
    ){
        CategoryResponse categoryResponse = categoryService.getAllCategories(pageNumber, pageSize, sortBy, sortOrder, keyword, status, minProducts, maxProducts);
        return new ResponseEntity<>(categoryResponse, HttpStatus.OK);
    }

    @PostMapping("/admin/category")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO categoryDTO){
        CategoryDTO saveCategory = categoryService.createCategory(categoryDTO);
        return new ResponseEntity<>(saveCategory, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/categories")
    public ResponseEntity<List<CategoryDTO>> deleteCategories(@RequestBody List<Long> categoryIds){
        List<CategoryDTO> categories = categoryService.deleteCategories(categoryIds);
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/category/{categoryId}/status")
    public ResponseEntity<CategoryDTO> updateCategoryStatus(
            @PathVariable Long categoryId,
            @RequestParam String status) {
        CategoryDTO categoryDTO = categoryService.updateCategoryStatus(categoryId, status);
        return new ResponseEntity<>(categoryDTO, HttpStatus.OK);
    }

    @PutMapping("/admin/category/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long categoryId,@Valid @RequestBody CategoryDTO categoryDTO){
        CategoryDTO updateCategory = categoryService.updateCategory(categoryId, categoryDTO);
        return new ResponseEntity<>(updateCategory, HttpStatus.OK);
    }
}
