package org.vinhduyle.superdupermart.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.vinhduyle.superdupermart.dao.UserDao;
import org.vinhduyle.superdupermart.domain.User;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedAdmin() {
        if (userDao.findByUsername("admin") == null) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("adminPassword"))
                    .role(User.Role.ADMIN)
                    .build();
            userDao.save(admin);
            System.out.println("Seeded admin account: admin/adminPassword");
        }
    }
}
