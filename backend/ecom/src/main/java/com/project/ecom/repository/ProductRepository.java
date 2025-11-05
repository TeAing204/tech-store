package com.project.ecom.repository;

import com.project.ecom.model.Brand;
import com.project.ecom.model.Category;
import com.project.ecom.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByIsActiveTrueAndDeletedAtIsNull(Pageable pageDetails);

    Long countByCategory_CategoryId(Long categoryId);
    Long countByBrand_BrandId(Long brandId);

    boolean existsByProductName(String productName);

    @Query("""
        SELECT p FROM Product p
        WHERE p.deletedAt IS NOT NULL
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:brandId IS NULL OR p.brand.id = :brandId)
        AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<Product> findInTrash(Long categoryId, Long brandId, String keyword, Pageable pageDetails);

    @Query(""" 
        SELECT p FROM Product p
        WHERE p.deletedAt IS NULL
          AND (:isAdmin = true OR p.isActive = true)
          AND (:categoryId IS NULL OR p.category.id = :categoryId)
          AND (:brandId IS NULL OR p.brand.id = :brandId)
          AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<Product> findAllWithFilters(
            @Param("isAdmin") boolean isAdmin,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

}
