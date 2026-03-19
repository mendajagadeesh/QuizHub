package com.Jagdev.QuizApp.Payloads;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UserDto {
private int id;
private String username;
private String email;
private String password;
private Set<String> roles;
}
