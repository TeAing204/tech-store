package com.project.ecom.service;

import com.project.ecom.exception.ResourceNotFoundException;
import com.project.ecom.model.Address;
import com.project.ecom.model.User;
import com.project.ecom.payload.AddressDTO;
import com.project.ecom.repository.AddressRepository;
import com.project.ecom.repository.UserRepository;
import com.project.ecom.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class AddressServiceImpl implements AddressService{
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AuthUtil authUtil;
    @Autowired
    private UserRepository userRepository;
    @Override
    public AddressDTO creatAddress(AddressDTO addressDTO) {
        User user = authUtil.loggedInUser();
        Address address = modelMapper.map(addressDTO, Address.class);
        address.setUser(user);
        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAllAddresses() {
        List<Address> addresses = addressRepository.findAll();
        List<AddressDTO> addressDTOS = addresses.stream().map(address -> modelMapper.map(address, AddressDTO.class)).toList();
        return addressDTOS;
    }

    @Override
    public AddressDTO getAddressById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", "id", addressId));
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddressesByUser() {
        User user = authUtil.loggedInUser();
        List<Address> addresses = user.getAddresses();
        List<AddressDTO> addressDTOList = addresses.stream().map(address -> modelMapper.map(address, AddressDTO.class)).toList();
        return addressDTOList;
    }

    @Override
    public AddressDTO updateAddress(AddressDTO addressDTO, Long addressId) {
        Address addressFindDB = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", "id", addressId));
        addressFindDB.setStreet(addressDTO.getStreet());
        addressFindDB.setStatus(addressDTO.getStatus());
        addressFindDB.setCountry(addressDTO.getCountry());
        addressFindDB.setBuildingName(addressDTO.getBuildingName());

        Address updatedAddress = addressRepository.save(addressFindDB);
        User user = addressFindDB.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        user.getAddresses().add(updatedAddress);
        userRepository.save(user);
        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    @Override
    public String deleteAddress(Long addressId) {
        Address addressFindDB = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ", "id", addressId));
        User user = addressFindDB.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        userRepository.save(user);
        addressRepository.delete(addressFindDB);
        return "Đã xóa địa chỉ có id: " + addressId;
    }

    @Override
    public AddressDTO createAddressForUser(Long userId, AddressDTO addressDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", userId));

        Address address = new Address();
        address.setBuildingName(addressDTO.getBuildingName());
        address.setStreet(addressDTO.getStreet());
        address.setCountry(addressDTO.getCountry());
        address.setUser(user);

        Address saved = addressRepository.save(address);
        return modelMapper.map(saved, AddressDTO.class);
    }

}
