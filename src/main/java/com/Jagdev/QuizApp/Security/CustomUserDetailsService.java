package com.Jagdev.QuizApp.Security;

import com.Jagdev.QuizApp.dao.UsersDao;
import com.Jagdev.QuizApp.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UsersDao usersDao;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users users=usersDao.findByEmail(email).orElseThrow(
                ()-> new UsernameNotFoundException("User not found with username: " + email)
        );
        Set<String> roles = users.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = Set.of("ROLE_USER");
        }

        return User.builder()
                .username(users.getEmail())
                .password(users.getPassword())
                .authorities(userAuthorities(roles))
                .build();
    }

    private Collection<? extends GrantedAuthority> userAuthorities(Set<String> roles) {
        return roles.stream().map(
                role->new SimpleGrantedAuthority(role)
        ).collect(Collectors.toList());
    }
}
