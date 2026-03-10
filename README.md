# QuizApp

A full-stack Quiz Application built with Spring Boot and a responsive vanilla JavaScript frontend. Create, manage, and take quizzes through a clean web interface or REST API.

## Tech Stack

- **Backend:** Spring Boot 4.0.3, Spring Data JPA, Hibernate
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript
- **Build Tool:** Maven

## Features

- **Question Management** — Add, edit, delete, and browse questions with category filtering
- **Quiz Creation** — Create quizzes by selecting a category and number of questions
- **Take Quizzes** — Answer multiple-choice questions and get instant scoring
- **Responsive UI** — Works on desktop, tablet, and mobile devices
- **REST API** — Full CRUD API for integration with other clients

## Prerequisites

- Java 25+
- MySQL 8.0+
- Maven 3.9+ (or use the included Maven wrapper)

## Setup

### 1. Database

Create a MySQL database named `test` (or update `application.properties`):

```sql
CREATE DATABASE test;
```

### 2. Configuration

Update database credentials in `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=root
```

### 3. Run

```bash
./mvnw spring-boot:run
```

The app starts at **http://localhost:8080**

## API Endpoints

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions/allQuestions` | Get all questions |
| GET | `/api/questions/category/{category}` | Get questions by category |
| POST | `/api/questions/add` | Add a new question |
| PUT | `/api/questions/update` | Update a question |
| DELETE | `/api/questions/delete/{id}` | Delete a question |

### Quiz

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/quiz/create?category=&numQ=&title=` | Create a quiz |
| GET | `/quiz/getquiz/{id}` | Get quiz questions |
| POST | `/quiz/submit/{id}` | Submit answers and get score |

### Sample Request — Add Question

```json
POST /api/questions/add
Content-Type: application/json

{
  "questionTitle": "What is JVM?",
  "option1": "Java Virtual Machine",
  "option2": "Java Version Manager",
  "option3": "Java Visual Monitor",
  "option4": "Java Variable Method",
  "rightAnswer": "Java Virtual Machine",
  "difficultyLevel": "Easy",
  "category": "Java"
}
```

## Project Structure

```
src/main/java/com/Jagdev/QuizApp/
├── QuizAppApplication.java          # Entry point
├── controller/
│   ├── QuestionController.java      # Question REST endpoints
│   └── QuizController.java          # Quiz REST endpoints
├── dao/
│   ├── QuestionDao.java             # Question repository
│   └── QuizDao.java                 # Quiz repository
├── model/
│   ├── Question.java                # Question entity
│   ├── QuestionWrapper.java         # Question DTO (hides answer)
│   ├── Quiz.java                    # Quiz entity
│   └── Response.java                # User response DTO
└── service/
    ├── QuestionService.java         # Question business logic
    └── QuizService.java             # Quiz business logic

src/main/resources/static/
├── index.html                       # Single-page frontend
├── css/style.css                    # Responsive styles
└── js/app.js                        # Frontend logic
```
