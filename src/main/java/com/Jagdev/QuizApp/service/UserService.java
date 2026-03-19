package com.Jagdev.QuizApp.service;

import com.Jagdev.QuizApp.Payloads.UserDto;
import com.Jagdev.QuizApp.dao.UsersDao;
import com.Jagdev.QuizApp.model.Users;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UsersDao usersDao;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public UserDto createUser(UserDto userDto) {
        
        Users users=modelMapper.map(userDto,Users.class);
        users.setPassword(passwordEncoder.encode(userDto.getPassword()));
        if(userDto.getRoles()!=null && !userDto.getRoles().isEmpty()){
            users.setRoles(userDto.getRoles());
        }
        else{
            users.setRoles(Set.of("ROLE_USER"));
        }
        usersDao.save(users);
        return modelMapper.map(users,UserDto.class);


    }
}
