package com.Green_Tech.Green_Tech.Repository;

import com.Green_Tech.Green_Tech.Entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorDataRepo extends JpaRepository<SensorData, Long> {
}
