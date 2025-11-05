package com.project.ecom.repository;

import com.project.ecom.model.User;
import com.project.ecom.model.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("""
    SELECT DISTINCT u FROM User u
    JOIN u.roles r
    WHERE r.roleName IN ('ROLE_ADMIN', 'ROLE_MANAGER')
    AND (:roleId IS NULL OR r.roleId = :roleId)
    AND (:status IS NULL OR u.status = :status)
    AND (:keyword IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
         OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
    AND u.deleteAt IS NULL
    """)
    Page<User> findAdminsAndManagers(
            Long roleId,
            UserStatus status,
            String keyword,
            Pageable pageDetails
    );

    @Query("""
    SELECT DISTINCT u FROM User u
    JOIN u.roles r
    WHERE r.roleName IN ('ROLE_ADMIN', 'ROLE_MANAGER')
    AND (:roleId IS NULL OR r.roleId = :roleId)
    AND (:keyword IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
         OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
    AND u.deleteAt IS NOT NULL
    """)
    Page<User> findDeletedAdminsAndManagers(
            Long roleId,
            String keyword,
            Pageable pageDetails
    );

    Optional<Object> findByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);
}
