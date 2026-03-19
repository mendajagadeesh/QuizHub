package com.Jagdev.QuizApp.controller;

import com.Jagdev.QuizApp.Payloads.JwtAuthenticationResponse;
import com.Jagdev.QuizApp.Payloads.Logindto;
import com.Jagdev.QuizApp.Payloads.UserDto;
import com.Jagdev.QuizApp.Security.JwtTokenProvider;
import com.Jagdev.QuizApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider  jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto){
        return new ResponseEntity<>(userService.createUser(userDto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> loginUser(@RequestBody Logindto logindto){
        Authentication authentication=
                authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(logindto.getEmail(), logindto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token= jwtTokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JwtAuthenticationResponse(token)
        );
    }


}
