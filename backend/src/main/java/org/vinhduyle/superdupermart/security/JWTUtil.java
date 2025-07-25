package org.vinhduyle.superdupermart.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.vinhduyle.superdupermart.domain.User;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JWTUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final long jwtExpirationMs = 86400000; // 24 hours

    private Key key;

    @PostConstruct
    public void init() {
        System.out.println("JWT Secret: " + jwtSecret);
        byte[] decodedKey = Base64.getDecoder().decode(jwtSecret);
        this.key = Keys.hmacShaKeyFor(decodedKey);
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .claim("id", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public Long getUserIdFromToken(String token) {
        return ((Number) Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("id")).longValue();
    }

    public String getRoleFromToken(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("role");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
