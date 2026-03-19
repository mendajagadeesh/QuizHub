package com.Jagdev.QuizApp.dao;

import com.Jagdev.QuizApp.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersDao extends JpaRepository<Users,Integer> {
    Optional<Users> findByEmail(String email);
    
}
