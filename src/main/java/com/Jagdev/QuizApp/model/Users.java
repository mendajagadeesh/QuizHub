package com.Jagdev.QuizApp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "users",uniqueConstraints = {
    @UniqueConstraint(columnNames={"email"})
})
public class Users {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
private int id;
private String username;
private String email;
private String password;

@ElementCollection(fetch = FetchType.EAGER)
private Set<String> roles=new HashSet<>();
    
}
