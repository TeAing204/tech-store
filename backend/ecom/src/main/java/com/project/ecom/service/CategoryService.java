package com.project.ecom.service;

import com.project.ecom.model.CategoryStatus;
import com.project.ecom.payload.CategoryDTO;
import com.project.ecom.payload.CategoryResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface CategoryService {
    CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, CategoryStatus status, Long minProducts, Long maxProducts);

    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryDTO updateCategory(Long categoryId, @Valid CategoryDTO categoryDTO);

    List<CategoryDTO> deleteCategories(List<Long> categoryIds);

    CategoryDTO updateCategoryStatus(Long categoryId, String status);
}
