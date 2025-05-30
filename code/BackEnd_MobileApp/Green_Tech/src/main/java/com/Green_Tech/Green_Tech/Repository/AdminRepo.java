package com.Green_Tech.Green_Tech.Repository;

import com.Green_Tech.Green_Tech.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface AdminRepo extends JpaRepository<Admin, Long> {
    boolean existsByEmail(String mail);

    Optional<Admin> findByEmail(String email);
}
