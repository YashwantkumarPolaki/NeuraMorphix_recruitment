package com.neuramorphix.recruitment_backend.repository;

import com.neuramorphix.recruitment_backend.entity.ApplicantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicantRepository extends JpaRepository<ApplicantEntity, Long> {
    Optional<ApplicantEntity> findByApplicationId(String applicationId);
    Optional<ApplicantEntity> findByEmail(String email);
    Optional<ApplicantEntity> findByApplicationIdAndEmail(String applicationId, String email);
}
