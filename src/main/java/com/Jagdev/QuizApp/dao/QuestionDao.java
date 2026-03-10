package com.Jagdev.QuizApp.dao;

import com.Jagdev.QuizApp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionDao extends JpaRepository<Question,Integer> {



   List<Question> findByCategory(String Category);

   @Query(value = "select * from Quiz as q where q.category=:category order by Random() limit :numQ",nativeQuery = true)
   List<Question> findRandomQuestionByCategory(String category, int numQ);
}
