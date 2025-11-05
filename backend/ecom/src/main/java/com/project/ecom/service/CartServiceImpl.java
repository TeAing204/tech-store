package com.project.ecom.service;

import com.project.ecom.exception.APIException;
import com.project.ecom.exception.ResourceNotFoundException;
import com.project.ecom.model.Cart;
import com.project.ecom.model.CartItem;
import com.project.ecom.model.Product;
import com.project.ecom.payload.CartDTO;
import com.project.ecom.payload.CartItemDTO;
import com.project.ecom.payload.ProductDTO;
import com.project.ecom.repository.CartItemRepository;
import com.project.ecom.repository.CartRepository;
import com.project.ecom.repository.ProductRepository;
import com.project.ecom.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
@Transactional
public class CartServiceImpl implements CartService{
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private AuthUtil authUtil;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public CartDTO addProductToCart(Long productId, Integer quantity) {
        Cart cart = creatCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));
        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(productId, cart.getCartId());
        if(cartItem != null){
            throw new APIException("Sản phẩm " + product.getProductName() + " đã tồn tại");
        }
        if(product.getQuantity() == 0){
            throw new APIException("Sản phẩm " + product.getProductName() + " không có sẵn");
        }
        if(product.getQuantity() < quantity){
            throw new APIException("Sản phẩm " + product.getProductName() + " chỉ còn lại " + product.getQuantity());
        }
        CartItem newCartItem = new CartItem();
        newCartItem.setProduct(product);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(quantity);
        newCartItem.setDiscount(product.getDiscount());
        newCartItem.setProductPrice(product.getSpecialPrice());
        cartItemRepository.save(newCartItem);
        product.setQuantity(product.getQuantity() - quantity);
        cart.setTotalPrice(cart.getTotalPrice() + product.getSpecialPrice() * quantity);
        cartRepository.save(cart);
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<CartItem> cartItems = cart.getCartItems();
        Stream<ProductDTO> productDTOStream = cartItems.stream().map(item -> {
            ProductDTO map = modelMapper.map(item.getProduct(), ProductDTO.class);
            map.setQuantity(item.getQuantity());
            return map;
        });
        cartDTO.setProducts(productDTOStream.toList());
        return cartDTO;
    }

    @Override
    public List<CartDTO> getCarts() {
        List<Cart> carts = cartRepository.findAll();
        if (carts.isEmpty()){
            throw new APIException("Giỏ hàng không tồn tại");
        }
        List<CartDTO> cartDTOS = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> productDTOS = cart.getCartItems().stream()
                    .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class))
                    .toList();
            cartDTO.setProducts(productDTOS);
            return cartDTO;
        }).toList();
        return cartDTOS;
    }

    @Override
    public CartDTO getCart() {
        String emailId = authUtil.loggedInEmail();
        Cart cart = cartRepository.findCartByEmail(emailId);
        Long cartId = cart.getCartId();
        Cart cartFindDB = cartRepository.findCartByEmailAndCartId(emailId, cartId);
        if(cartFindDB == null){
            throw new ResourceNotFoundException("Giỏ hàng", "id", cartId);
        }
        CartDTO cartDTO = modelMapper.map(cartFindDB, CartDTO.class);
        cartFindDB.getCartItems().forEach(c -> c.getProduct().setQuantity(c.getQuantity()));
        List<ProductDTO> productDTOS = cartFindDB.getCartItems().stream().map(cartItem -> {
            ProductDTO productDTO = modelMapper.map(cartItem.getProduct(), ProductDTO.class);
            productDTO.setQuantity(cartItem.getQuantity());
            return productDTO;
        }).toList();
        cartDTO.setProducts(productDTOS);
        return cartDTO;
    }

    @Override
    public CartDTO updateProductQuantityInCart(Long productId, Integer quantity) {
        String email = authUtil.loggedInEmail();
        Cart userCart = cartRepository.findCartByEmail(email);
        Long cartId = userCart.getCartId();
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", cartId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));
        if(product.getQuantity() == 0){
            throw new APIException("Sản phẩm không có sẵn");
        }
        if(product.getQuantity() < quantity){
            throw new APIException("Sản phẩm không đủ, sản phẩm trong kho chỉ còn lại " + product.getQuantity() + " sản phẩm");
        }
        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(productId, cartId);
        if(cartItem == null){
            throw new APIException("Sản phẩm không có sẵn trong giỏ hàng");
        }
        int newQuantity = cartItem.getQuantity() + quantity;
        if(newQuantity < 0){
            throw new APIException("Số lượng không thể là số âm");
        }
        if(newQuantity == 0){
            deleteProductFromCart(cartId, productId);
        } else {
            cartItem.setProductPrice(product.getSpecialPrice());
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItem.setDiscount(product.getDiscount());
            cart.setTotalPrice(cart.getTotalPrice() + cartItem.getProductPrice() * quantity);
            cartRepository.save(cart);
        }
        CartItem updateItem = cartItemRepository.save(cartItem);
        if(updateItem.getQuantity() == 0){
            cartItemRepository.deleteById(updateItem.getCartItemId());
        }
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<CartItem> cartItems =  cart.getCartItems();
        Stream<ProductDTO> productDTOStream = cartItems.stream().map(item -> {
            ProductDTO prd = modelMapper.map(item.getProduct(), ProductDTO.class);
            prd.setQuantity(item.getQuantity());
            return prd;
        });
        cartDTO.setProducts(productDTOStream.toList());
        return cartDTO;
    }

    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", cartId));
        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(productId, cartId);
        if(cartItem == null){
            throw new ResourceNotFoundException("Sản phẩm", "id", productId);
        }
        cart.setTotalPrice(cart.getTotalPrice() - cartItem.getProductPrice() * cartItem.getQuantity());
        cartItemRepository.deleteCartItemByProductIdAndCartId(productId, cartId);
        return "Sản phẩm " + cartItem.getProduct().getProductName() + " đã được xóa";
    }

    @Override
    public String createOrUpdateCartWithItems(List<CartItemDTO> cartItems) {
        String emailId = authUtil.loggedInEmail();
        Cart existingCart = cartRepository.findCartByEmail(emailId);
        if(existingCart == null){
            existingCart = new Cart();
            existingCart.setTotalPrice(0.0);
            existingCart.setUser(authUtil.loggedInUser());
            existingCart = cartRepository.save(existingCart);
        } else {
            cartItemRepository.deleteAllByCartId(existingCart.getCartId());
        }
        double totalPrice = 0.0;
        for (CartItemDTO cartItemDTO : cartItems){
            Long productId = cartItemDTO.getProductId();
            Integer quantity = cartItemDTO.getQuantity();
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));
            product.setQuantity(product.getQuantity() - quantity);
            totalPrice += product.getSpecialPrice() * quantity;
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setCart(existingCart);
            cartItem.setQuantity(quantity);
            cartItem.setProductPrice(product.getSpecialPrice());
            cartItem.setDiscount(product.getDiscount());
            cartItemRepository.save(cartItem);
        }
        existingCart.setTotalPrice(totalPrice);
        cartRepository.save(existingCart);
        return "Giỏ hàng đã tạo/cập nhật thành công";
    }

    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng", "id", cartId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("sản phẩm", "id", productId));
        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(productId, cartId);
        if(cartItem == null){
            throw new APIException("Sản phẩm " + product.getProductName() + " không có trong giỏ hàng");
        }
        double cartPrice = cart.getTotalPrice() - cartItem.getProductPrice() * cartItem.getQuantity();
        cartItem.setProductPrice(product.getSpecialPrice());
        cart.setTotalPrice(cartPrice + cartItem.getProductPrice() * cartItem.getQuantity());
    }


    private Cart creatCart(){
        Cart userCart = cartRepository.findCartByEmail(authUtil.loggedInEmail());
        if(userCart != null){
            return userCart;
        }
        Cart cart = new Cart();
        cart.setTotalPrice(0.0);
        cart.setUser(authUtil.loggedInUser());
        return cartRepository.save(cart);
    }
}
