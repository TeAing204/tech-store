package com.project.ecom.service;

import com.project.ecom.payload.OrderDTO;

public interface OrderService {
    OrderDTO placeOrder(Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);
}
