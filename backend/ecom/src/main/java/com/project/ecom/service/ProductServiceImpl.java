package com.project.ecom.service;

import com.project.ecom.exception.APIException;
import com.project.ecom.exception.ResourceNotFoundException;
import com.project.ecom.model.*;
import com.project.ecom.payload.*;
import com.project.ecom.repository.BrandRepository;
import com.project.ecom.repository.CartRepository;
import com.project.ecom.repository.CategoryRepository;
import com.project.ecom.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Service
public class ProductServiceImpl implements ProductService{
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String path;
    @Value("${image.base.url}")
    private String imageBaseUrl;


    @Override
    public ProductDTO addProduct(Long categoryId, ProductRequest req, List<MultipartFile> images) throws IOException {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", categoryId));

        Brand brand = brandRepository.findById(req.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", req.getBrandId()));

        boolean exists = productRepository.existsByProductName(req.getProductName());
        if (exists) {
            throw new APIException("Sản phẩm đã tồn tại");
        }

        Product product = new Product();
        product.setProductName(req.getProductName());
        product.setDescription(req.getDescription());
        product.setCategory(category);
        product.setBrand(brand);
        product.setQuantity(req.getQuantity());
        product.setPrice(req.getPrice());
        product.setDiscount(req.getDiscount());
        product.setSpecialPrice(req.getPrice() - (req.getPrice() * req.getDiscount() / 100));
        product.setActive(true);


        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String fileName = fileService.uploadImage(path, image);
                ProductImage img = new ProductImage();
                img.setFileName(fileName);
                img.setProduct(product);
                product.getImages().add(img);
            }
            product.setImage(product.getImages().get(0).getFileName());
        } else {
            product.setImage("default.png");
        }

        Product saved = productRepository.save(product);
        return modelMapper.map(saved, ProductDTO.class);
    }

    @Override
    public ProductResponse getProducts(Authentication authentication,
                                       Integer pageNumber,
                                       Integer pageSize,
                                       String sortBy,
                                       String sortOrder,
                                       Long categoryId,
                                       Long brandId,
                                       String keyword) {

        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        boolean isAdmin = false;
        if (authentication != null && authentication.isAuthenticated()) {
            isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")
                            || auth.getAuthority().equals("ROLE_MANAGER"));
        }

        Page<Product> productPage = productRepository.findAllWithFilters(
                isAdmin,
                categoryId,
                brandId,
                (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null,
                pageable
        );

        if (productPage.isEmpty()) {
            throw new APIException("Không có sản phẩm nào");
        }

        List<ProductDTO> productDTOS = productPage.getContent().stream().map(product -> {
            ProductDTO dto = modelMapper.map(product, ProductDTO.class);

            // Gán danh sách ảnh
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                List<ImageProductDTO> imageList = product.getImages().stream().map(img -> {
                    ImageProductDTO imgDto = new ImageProductDTO();
                    imgDto.setId(img.getId());
                    imgDto.setFileName(img.getFileName());
                    imgDto.setUrl(constructImageUrl(img.getFileName()));
                    return imgDto;
                }).toList();
                dto.setImages(imageList);

                // Ảnh chính = ảnh đầu tiên
                dto.setImage(imageList.get(0).getUrl());
            } else {
                dto.setImage(constructImageUrl("default.png"));
            }

            if (product.getCategory() != null) {
                dto.setCategoryDTO(modelMapper.map(product.getCategory(), CategoryDTO.class));
            }
            if (product.getBrand() != null) {
                dto.setBrandDTO(modelMapper.map(product.getBrand(), BrandDTO.class));
            }

            return dto;
        }).toList();


        ProductResponse response = new ProductResponse();
        response.setContent(productDTOS);
        response.setPageNumber(productPage.getNumber());
        response.setPageSize(productPage.getSize());
        response.setTotalElements(productPage.getTotalElements());
        response.setTotalPages(productPage.getTotalPages());
        response.setLastPage(productPage.isLast());

        return response;
    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductRequest req, List<MultipartFile> images) throws IOException {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", req.getCategoryId()));

        Brand brand = brandRepository.findById(req.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", req.getBrandId()));

        product.setProductName(req.getProductName());
        product.setDescription(req.getDescription());
        product.setQuantity(req.getQuantity());
        product.setPrice(req.getPrice());
        product.setBrand(brand);
        product.setCategory(category);
        product.setDiscount(req.getDiscount());
        product.setSpecialPrice(req.getPrice() - (req.getPrice() * req.getDiscount() / 100));

        if (images != null && !images.isEmpty()) {
            for (ProductImage oldImg : product.getImages()) {
                fileService.deleteImage(path, oldImg.getFileName());
            }
            product.getImages().clear();

            for (MultipartFile file : images) {
                String fileName = fileService.uploadImage(path, file);
                ProductImage img = new ProductImage();
                img.setFileName(fileName);
                img.setProduct(product);
                product.getImages().add(img);
            }
            product.setImage(product.getImages().get(0).getFileName());
        } else {
            System.out.println("Không có ảnh mới, giữ nguyên ảnh cũ");
        }


        Product saved = productRepository.save(product);
        return modelMapper.map(saved, ProductDTO.class);
    }

    @Override
    public ProductDTO updateProductStatus(Long productId, boolean active) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));
        product.setActive(active);
        productRepository.save(product);
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public List<ProductDTO> softDeleteProducts(List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        for (Product product : products) {
            if (product.isActive()) {
                product.setActive(false);
            }
            product.setDeletedAt(LocalDateTime.now());
        }
        productRepository.saveAll(products);
        List<ProductDTO> productDTOS = products.stream().map(product -> modelMapper.map(product, ProductDTO.class)).toList();
        return productDTOS;
    }

    @Override
    public List<ProductDTO> deleteProducts(List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);

        List<ProductDTO> dtos = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();

        for (Product product : products) {
            productRepository.delete(product);
        }

        return dtos;
    }

    @Override
    public List<ProductDTO> restoreProducts(List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        for (Product product : products){
            product.setDeletedAt(null);
        }
        productRepository.saveAll(products);
        List<ProductDTO> productDTOS = products.stream().map(product -> modelMapper.map(product, ProductDTO.class)).toList();
        return productDTOS;
    }


    @Override
    public ProductResponse getProductsInTrash(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long categoryId, Long brandId, String keyword) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Product> productPage = productRepository.findInTrash(categoryId, brandId, keyword, pageDetails);
        List<Product> products = productPage.getContent();

        if (products.isEmpty()) {
            throw new APIException("Không có sản phẩm nào");
        }

        List<ProductDTO> productDTOS = products.stream().map(product -> {
            ProductDTO dto = modelMapper.map(product, ProductDTO.class);

            // Xử lý ảnh chính
            String mainImageUrl;
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                mainImageUrl = constructImageUrl(product.getImages().get(0).getFileName());
            } else if (product.getImage() != null) {
                mainImageUrl = constructImageUrl(product.getImage());
            } else {
                mainImageUrl = constructImageUrl("default.png");
            }
            dto.setImage(mainImageUrl);

            // ✅ Bổ sung phần bị thiếu
            if (product.getCategory() != null) {
                dto.setCategoryDTO(modelMapper.map(product.getCategory(), CategoryDTO.class));
            }
            if (product.getBrand() != null) {
                dto.setBrandDTO(modelMapper.map(product.getBrand(), BrandDTO.class));
            }

            return dto;
        }).toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(productPage.getNumber());
        productResponse.setPageSize(productPage.getSize());
        productResponse.setTotalElements(productPage.getTotalElements());
        productResponse.setTotalPages(productPage.getTotalPages());
        productResponse.setLastPage(productPage.isLast());

        return productResponse;
    }


    private String constructImageUrl(String imageName){
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }
}
