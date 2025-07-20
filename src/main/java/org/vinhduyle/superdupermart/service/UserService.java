package org.vinhduyle.superdupermart.service;

import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.vinhduyle.superdupermart.dao.UserDao;
import org.vinhduyle.superdupermart.domain.User;
import org.vinhduyle.superdupermart.dto.LoginRequest;
import org.vinhduyle.superdupermart.dto.RegistrationRequest;
import org.vinhduyle.superdupermart.exception.InvalidCredentialsException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserDao userDao;

//    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public User registerUser(RegistrationRequest request) {
        if (userDao.findByUsername(request.getUsername()) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userDao.findByEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }

//        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())  //hashedPassword
                .role(User.Role.USER)  // Always USER for this flow
                .build();

        userDao.save(user);
        return user;
    }

    @Transactional
    public User login(LoginRequest request) {
        User user = userDao.findByUsername(request.getUsername());
//        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//            throw new InvalidCredentialsException("Incorrect credentials, please try again.");
//        }
        if (user == null || !request.getPassword().equals(user.getPassword())) {
            throw new InvalidCredentialsException("Incorrect credentials, please try again.");
        }
        return user;
    }
}
