package com.Jagdev.QuizApp.controller;

import com.Jagdev.QuizApp.model.Question;
import com.Jagdev.QuizApp.model.QuestionWrapper;
import com.Jagdev.QuizApp.model.Response;
import com.Jagdev.QuizApp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
public class QuizController {

    @Autowired
    QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestParam String category,
                                             @RequestParam int numQ,
                                             @RequestParam String title) {
        return quizService.createQuiz(category, numQ, title);
    }

    @GetMapping("getquiz/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestion(@PathVariable int id) {
         return quizService.getQuizQuestions(id);
    }

    @PostMapping("/submit/{id}")
    public ResponseEntity<Integer> submitQuiz(@PathVariable int id,
    @RequestBody List<Response> responses) {
        return quizService.calculateResult(id,responses);
    }
}