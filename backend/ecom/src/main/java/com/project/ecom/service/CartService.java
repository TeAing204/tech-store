package com.project.ecom.service;

import com.project.ecom.payload.CartDTO;
import com.project.ecom.payload.CartItemDTO;

import java.util.List;

public interface CartService {
    CartDTO addProductToCart(Long productId, Integer quantity);

    List<CartDTO> getCarts();

    CartDTO getCart();

    CartDTO updateProductQuantityInCart(Long productId, Integer quantity);

    String deleteProductFromCart(Long cartId, Long productId);

    String createOrUpdateCartWithItems(List<CartItemDTO> cartItems);

    void updateProductInCarts(Long cartId, Long productId);
//    void updateProductInCarts(Long cartId, Long productId);
}
