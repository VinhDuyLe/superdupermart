// superdupermart/backend/src/main/java/org/vinhduyle/superdupermart/config/CorsConfig.java
package org.vinhduyle.superdupermart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // <-- Must be here
public class CorsConfig implements WebMvcConfigurer { // <-- Must implement this

    @Override // <-- Must override this method
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200") // <-- EXACTLY this URL
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}