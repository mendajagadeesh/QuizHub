package com.Jagdev.QuizApp.model;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "quiz_test")
public class Quiz {


    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer id;
    private String title;

    @ManyToMany
    private List<Question> questions;
}


