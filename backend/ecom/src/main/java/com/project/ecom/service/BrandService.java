package com.project.ecom.service;

import com.project.ecom.model.BrandStatus;
import com.project.ecom.payload.BrandDTO;
import com.project.ecom.payload.BrandResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface BrandService {

    BrandDTO createBrand(BrandDTO brandDTO);

    BrandResponse getAllBrands(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, BrandStatus status, Long minProducts, Long maxProducts);

    List<BrandDTO> deleteBrands(List<Long> brandIds);

    BrandDTO updateBrandStatus(Long brandId, String status);

    BrandDTO updateBrand(Long brandId, @Valid BrandDTO brandDTO);
}
