// src/main/java/org/vinhduyle/superdupermart/security/CustomUserDetails.java
package org.vinhduyle.superdupermart.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User; // Important: Import Spring Security's User
import java.util.Collection;

public class CustomUserDetails extends User {

    private final Long id;

    public CustomUserDetails(Long id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}