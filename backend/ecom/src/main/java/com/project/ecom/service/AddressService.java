package com.project.ecom.service;

import com.project.ecom.payload.AddressDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface AddressService {
    AddressDTO creatAddress(@Valid AddressDTO addressDTO);

    List<AddressDTO> getAllAddresses();

    AddressDTO getAddressById(Long addressId);

    List<AddressDTO> getAddressesByUser();

    AddressDTO updateAddress(@Valid AddressDTO addressDTO, Long addressId);

    String deleteAddress(Long addressId);

    AddressDTO createAddressForUser(Long userId, @Valid AddressDTO addressDTO);
}
