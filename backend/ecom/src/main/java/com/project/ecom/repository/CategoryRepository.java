package com.project.ecom.repository;

import com.project.ecom.model.Category;
import com.project.ecom.model.CategoryStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByCategoryName(String categoryName);
    Page<Category> findByStatus(CategoryStatus status, Pageable pageable);
    Page<Category> findByCategoryNameContainingIgnoreCase(String keyword, Pageable pageDetails);

    Page<Category> findByStatusAndCategoryNameContainingIgnoreCase(CategoryStatus status, String keyword, Pageable pageDetails);
}
