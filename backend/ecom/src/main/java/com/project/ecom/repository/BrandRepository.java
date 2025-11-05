package com.project.ecom.repository;

import com.project.ecom.model.Brand;
import com.project.ecom.model.BrandStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    Brand findByBrandName(String brandName);

    Page<Brand> findByStatusAndBrandNameContainingIgnoreCase(BrandStatus status, String keyword, Pageable pageDetails);

    Page<Brand> findByBrandNameContainingIgnoreCase(String keyword, Pageable pageDetails);

    Page<Brand> findByStatus(BrandStatus status, Pageable pageDetails);

}
