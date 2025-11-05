package com.project.ecom.service;

import com.project.ecom.exception.APIException;
import com.project.ecom.exception.ResourceNotFoundException;
import com.project.ecom.model.Category;
import com.project.ecom.model.CategoryStatus;
import com.project.ecom.model.User;
import com.project.ecom.model.UserStatus;
import com.project.ecom.payload.CategoryDTO;
import com.project.ecom.payload.CategoryResponse;
import com.project.ecom.payload.UserDTO;
import com.project.ecom.repository.CategoryRepository;
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
public class CategoryServiceImpl implements CategoryService{
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AuthUtil authUtil;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Override
    public CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, CategoryStatus status, Long minProducts, Long maxProducts) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Category> categoryPage;
        if (keyword != null && !keyword.isBlank() && status != null) {
            categoryPage = categoryRepository.findByStatusAndCategoryNameContainingIgnoreCase(status, keyword, pageDetails);
        } else if (keyword != null && !keyword.isBlank()) {
            categoryPage = categoryRepository.findByCategoryNameContainingIgnoreCase(keyword, pageDetails);
        } else if (status != null) {
            categoryPage = categoryRepository.findByStatus(status, pageDetails);
        } else {
            categoryPage = categoryRepository.findAll(pageDetails);
        }

        List<Category> categories = categoryPage.getContent();
        if (categories.isEmpty()){
            throw new APIException("Hiện tại vẫn chưa có danh mục nào");
        }
        List<CategoryDTO> categoryDTOS = categories.stream().map(category -> {
            CategoryDTO dto = modelMapper.map(category, CategoryDTO.class);
            Long count = productRepository.countByCategory_CategoryId(category.getCategoryId());
            dto.setTotalProducts(count);
            if (minProducts != null && count < minProducts) return null;
            if (maxProducts != null && count > maxProducts) return null;
            return dto;
        }).filter(Objects::nonNull).toList();
        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setContent(categoryDTOS);
        categoryResponse.setPageNumber(categoryPage.getNumber());
        categoryResponse.setPageSize(categoryPage.getSize());
        categoryResponse.setTotalElements(categoryPage.getTotalElements());
        categoryResponse.setTotalPages(categoryPage.getTotalPages());
        categoryResponse.setLastPage(categoryPage.isLast());
        return categoryResponse;
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO, Category.class);
        Category categoryFinDB = categoryRepository.findByCategoryName(category.getCategoryName());
        if(categoryFinDB != null){
            throw new APIException("Danh mục " + category.getCategoryName() + " đã tồn tại!");
        }
        category.setTotalProducts(0L);
        User currentUser = authUtil.loggedInUser();
        category.setCreatedBy(currentUser.getUsername());
        category.setCreatedAt(LocalDateTime.now());
        if (category.getStatus() == null) {
            category.setStatus(CategoryStatus.ACTIVE);
        }
        Category saveCategory = categoryRepository.save(category);
        return modelMapper.map(saveCategory, CategoryDTO.class);
    }

    @Override
    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        Category categoryFindDB = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", categoryId));

        categoryFindDB.setCategoryName(categoryDTO.getCategoryName());
        categoryFindDB.setDescription(categoryDTO.getDescription());
        User currentUser = authUtil.loggedInUser();
        categoryFindDB.setUpdatedBy(currentUser.getUsername());
        categoryFindDB.setUpdatedAt(LocalDateTime.now());

        Category savedCategory = categoryRepository.save(categoryFindDB);
        return modelMapper.map(savedCategory, CategoryDTO.class);
    }

    @Override
    public List<CategoryDTO> deleteCategories(List<Long> categoryIds) {
        List<Category> categories = categoryRepository.findAllById(categoryIds);
        List<CategoryDTO> dtos = categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .toList();
        categoryRepository.deleteAllByIdInBatch(categoryIds);
        return dtos;
    }

    @Override
    public CategoryDTO updateCategoryStatus(Long categoryId, String status) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", categoryId));
        try {
            CategoryStatus newStatus = CategoryStatus.valueOf(status.trim().toUpperCase());
            category.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status);
        }

        categoryRepository.save(category);
        return modelMapper.map(category, CategoryDTO.class);
    }

}
