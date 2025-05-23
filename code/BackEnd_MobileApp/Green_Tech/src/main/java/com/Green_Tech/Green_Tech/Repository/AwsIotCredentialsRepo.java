package com.Green_Tech.Green_Tech.Repository;

import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface AwsIotCredentialsRepo extends JpaRepository<AwsIotCredentials, Long> {
    @Query("SELECT a FROM AwsIotCredentials a JOIN a.device d where d.active = :status")
    List<AwsIotCredentials> findAllByActiveDevices(@Param("status") boolean status);
}
