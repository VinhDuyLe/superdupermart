// src/main/java/org/vinhduyle/superdupermart/security/CustomUserDetailsService.java
package org.vinhduyle.superdupermart.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.vinhduyle.superdupermart.dao.UserDao;
import org.vinhduyle.superdupermart.domain.User; // Your domain User

import java.util.Collections;
import java.util.stream.Collectors; // Added for multiple roles if needed

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDao userDao;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        org.vinhduyle.superdupermart.domain.User user = userDao.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Use your CustomUserDetails to store the user ID
        return new CustomUserDetails(
                user.getId(), // Store the user ID
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                // If User domain had multiple roles (Set<Role>), it would look like this:
                // user.getRoles().stream()
                //     .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                //     .collect(Collectors.toList())
        );
    }
}