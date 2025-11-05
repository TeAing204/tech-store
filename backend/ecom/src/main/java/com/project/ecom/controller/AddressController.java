package com.project.ecom.controller;

import com.project.ecom.payload.AddressDTO;
import com.project.ecom.service.AddressService;
import com.project.ecom.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO){
        AddressDTO saveAddress = addressService.creatAddress(addressDTO);
        return new ResponseEntity<>(saveAddress, HttpStatus.CREATED);
    }

    @PostMapping("/addresses/user/{userId}")
    public ResponseEntity<AddressDTO> createAddressForUser(
            @PathVariable Long userId,
            @Valid @RequestBody AddressDTO addressDTO) {
        AddressDTO savedAddress = addressService.createAddressForUser(userId, addressDTO);
        return new ResponseEntity<>(savedAddress, HttpStatus.CREATED);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAddress(){
        List<AddressDTO> addressDTOS = addressService.getAllAddresses();
        return new ResponseEntity<>(addressDTOS, HttpStatus.OK);
    }

    @GetMapping("/address/{addressId}")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Long addressId){
        AddressDTO addressDTO = addressService.getAddressById(addressId);
        return new ResponseEntity<>(addressDTO, HttpStatus.OK);
    }
    @GetMapping("/addresses/users")
    public ResponseEntity<List<AddressDTO>> getAddressesByUser(){
        List<AddressDTO> addressDTOS = addressService.getAddressesByUser();
        return new ResponseEntity<>(addressDTOS, HttpStatus.OK);
    }

    @PutMapping("/address/{addressId}")
    public ResponseEntity<AddressDTO> updateAddress(@Valid @RequestBody AddressDTO addressDTO, @PathVariable Long addressId){
        AddressDTO updatedAddress = addressService.updateAddress(addressDTO, addressId);
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
    }

    @DeleteMapping("/address/{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long addressId){
        String status = addressService.deleteAddress(addressId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
