package com.project.ecom.controller;

import com.project.ecom.configuration.AppConstants;
import com.project.ecom.model.BrandStatus;
import com.project.ecom.payload.BrandDTO;
import com.project.ecom.payload.BrandResponse;
import com.project.ecom.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/")
@RestController
public class BrandController {
    @Autowired
    private BrandService brandService;

    @GetMapping("/public/brands")
    public ResponseEntity<BrandResponse> getBrands(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_BRAND_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "status", required = false) BrandStatus status,
            @RequestParam(name = "minProducts", required = false) Long minProducts,
            @RequestParam(name = "maxProducts", required = false) Long maxProducts
    ){
        BrandResponse brandResponse = brandService.getAllBrands(pageNumber, pageSize, sortBy, sortOrder, keyword, status, minProducts, maxProducts);
        return new ResponseEntity<>(brandResponse, HttpStatus.OK);
    }

    @PostMapping("/admin/brand")
    public ResponseEntity<BrandDTO> createBrand(@Valid @RequestBody BrandDTO brandDTO){
        BrandDTO saveBrand = brandService.createBrand(brandDTO);
        return new ResponseEntity<>(saveBrand, HttpStatus.CREATED);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/brands")
    public ResponseEntity<List<BrandDTO>> deleteBrands(@RequestBody List<Long> brandIds){
        List<BrandDTO> brands = brandService.deleteBrands(brandIds);
        return new ResponseEntity<>(brands, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/brand/{brandId}/status")
    public ResponseEntity<BrandDTO> updateBrandStatus(
            @PathVariable Long brandId,
            @RequestParam String status) {
        BrandDTO brandDTO = brandService.updateBrandStatus(brandId, status);
        return new ResponseEntity<>(brandDTO, HttpStatus.OK);
    }

    @PutMapping("/admin/brand/{brandId}")
    public ResponseEntity<BrandDTO> updateBrand(@PathVariable Long brandId,@Valid @RequestBody BrandDTO brandDTO){
        BrandDTO updateBrand = brandService.updateBrand(brandId, brandDTO);
        return new ResponseEntity<>(updateBrand, HttpStatus.OK);
    }
}
