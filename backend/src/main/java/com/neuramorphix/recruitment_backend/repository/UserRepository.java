package com.neuramorphix.recruitment_backend.repository;

import com.neuramorphix.recruitment_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

}