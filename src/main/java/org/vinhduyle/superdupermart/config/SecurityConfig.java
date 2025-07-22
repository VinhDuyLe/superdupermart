package org.vinhduyle.superdupermart.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.vinhduyle.superdupermart.security.CustomUserDetailsService;
import org.vinhduyle.superdupermart.security.JWTAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JWTAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/signup", "/login", "/products/all", "/products/{id}").permitAll()
                .antMatchers("/products/frequent/{id}", "/products/recent/{id}").authenticated() // Authenticated users for their frequent/recent
                .antMatchers("/orders/all").authenticated() // All authenticated users can access their orders or all orders if admin
                .antMatchers("/orders/{id}").authenticated() // Authenticated users can view specific order details
                .antMatchers("/orders/admin", "/products/popular/**", "/products/profit/**").hasRole("ADMIN")
                .antMatchers("POST", "/products").hasRole("ADMIN")
                .antMatchers("PATCH", "/products/**").hasRole("ADMIN")
                .antMatchers("PATCH", "/orders/*/complete").hasRole("ADMIN")
                .antMatchers("PATCH", "/orders/*/cancel").authenticated() // Users can cancel their own orders
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}