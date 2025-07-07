package com.Green_Tech.Green_Tech.Repository;

import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface DeviceRepo extends JpaRepository<Device, Long> {
    // Find all devices for a specific user
    List<Device> findByUser(User user);
    Device findByMac(String mac);
    boolean existsByMac(String mac);
    List<Device> findAllByUserId(Long id);
    List<Device> findByUserAndActive(User user, boolean status);
}
