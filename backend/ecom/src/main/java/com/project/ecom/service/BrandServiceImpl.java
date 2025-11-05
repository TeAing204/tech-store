package com.project.ecom.service;

import com.project.ecom.exception.APIException;
import com.project.ecom.exception.ResourceNotFoundException;
import com.project.ecom.model.*;
import com.project.ecom.model.Brand;
import com.project.ecom.payload.*;
import com.project.ecom.payload.BrandDTO;
import com.project.ecom.payload.BrandResponse;
import com.project.ecom.repository.BrandRepository;
import com.project.ecom.repository.ProductRepository;
import com.project.ecom.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class BrandServiceImpl implements BrandService{
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AuthUtil authUtil;

    @Override
    public BrandResponse getAllBrands(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, BrandStatus status, Long minProducts, Long maxProducts) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Brand> brandPage;
        if (keyword != null && !keyword.isBlank() && status != null) {
            brandPage = brandRepository.findByStatusAndBrandNameContainingIgnoreCase(status, keyword, pageDetails);
        } else if (keyword != null && !keyword.isBlank()) {
            brandPage = brandRepository.findByBrandNameContainingIgnoreCase(keyword, pageDetails);
        } else if (status != null) {
            brandPage = brandRepository.findByStatus(status, pageDetails);
        } else {
            brandPage = brandRepository.findAll(pageDetails);
        }

        List<Brand> brands = brandPage.getContent();
        if (brands.isEmpty()){
            throw new APIException("Hiện tại vẫn chưa có thương hiệu nào");
        }
        List<BrandDTO> brandDTOS = brands.stream().map(brand -> {
            BrandDTO dto = modelMapper.map(brand, BrandDTO.class);
            Long count = productRepository.countByBrand_BrandId(brand.getBrandId());
            dto.setTotalProducts(count);
            if (minProducts != null && count < minProducts) return null;
            if (maxProducts != null && count > maxProducts) return null;
            return dto;
        }).filter(Objects::nonNull).toList();
        BrandResponse brandResponse = new BrandResponse();
        brandResponse.setContent(brandDTOS);
        brandResponse.setPageNumber(brandPage.getNumber());
        brandResponse.setPageSize(brandPage.getSize());
        brandResponse.setTotalElements(brandPage.getTotalElements());
        brandResponse.setTotalPages(brandPage.getTotalPages());
        brandResponse.setLastPage(brandPage.isLast());
        return brandResponse;
    }

    @Override
    public List<BrandDTO> deleteBrands(List<Long> brandIds) {
        List<Brand> brands = brandRepository.findAllById(brandIds);
        List<BrandDTO> dtos = brands.stream()
                .map(brand -> modelMapper.map(brand, BrandDTO.class))
                .toList();
        brandRepository.deleteAllByIdInBatch(brandIds);
        return dtos;
    }

    @Override
    public BrandDTO updateBrandStatus(Long brandId, String status) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", brandId));
        try {
            BrandStatus newStatus = BrandStatus.valueOf(status.trim().toUpperCase());
            brand.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status);
        }

        brandRepository.save(brand);
        return modelMapper.map(brand, BrandDTO.class);
    }

    @Override
    public BrandDTO updateBrand(Long brandId, BrandDTO brandDTO) {
        Brand brandFindDB = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", brandId));

        brandFindDB.setBrandName(brandDTO.getBrandName());
        brandFindDB.setDescription(brandDTO.getDescription());
        User currentUser = authUtil.loggedInUser();
        brandFindDB.setUpdatedBy(currentUser.getUsername());
        brandFindDB.setUpdatedAt(LocalDateTime.now());

        Brand savedBrand = brandRepository.save(brandFindDB);
        return modelMapper.map(savedBrand, BrandDTO.class);
    }

    @Override
    public BrandDTO createBrand(BrandDTO brandDTO) {
        Brand brand = modelMapper.map(brandDTO, Brand.class);
        Brand brandFinDB = brandRepository.findByBrandName(brand.getBrandName());
        if(brandFinDB != null){
            throw new APIException("Thương hiệu " + brand.getBrandName() + " đã tồn tại!");
        }
        brand.setTotalProducts(0L);
        User currentUser = authUtil.loggedInUser();
        brand.setCreatedBy(currentUser.getUsername());
        brand.setCreatedAt(LocalDateTime.now());
        if (brand.getStatus() == null) {
            brand.setStatus(BrandStatus.ACTIVE);
        }
        Brand saveBrand = brandRepository.save(brand);
        return modelMapper.map(saveBrand, BrandDTO.class);
    }
}
