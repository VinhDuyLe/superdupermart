package org.vinhduyle.superdupermart.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Import HttpMethod
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
                .cors() //ENABLE CORS
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public endpoints (no auth required)
                .antMatchers("/signup", "/login").permitAll()

                // require a valid JWT token
                .antMatchers("/products/all", "/products/{id}").authenticated()
                .antMatchers("/products/frequent/{id}", "/products/recent/{id}").authenticated()
                .antMatchers("/orders/all").authenticated()
                .antMatchers("/orders/{id}").authenticated()
                .antMatchers("/orders", "/orders/**").authenticated()
                .antMatchers("PATCH", "/orders/*/cancel").authenticated()


                // Admin-only endpoints
                .antMatchers("/orders/admin", "/products/popular/**", "/products/profit/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/products").hasRole("ADMIN")
                .antMatchers(HttpMethod.PATCH, "/products/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PATCH, "/orders/*/complete").hasRole("ADMIN")
                .antMatchers(HttpMethod.GET, "/orders/admin/total-sold-items").hasRole("ADMIN")

                // other by default
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