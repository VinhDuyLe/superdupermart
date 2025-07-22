package org.vinhduyle.superdupermart;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.vinhduyle.superdupermart.dao.UserDao;
import org.vinhduyle.superdupermart.domain.User;

@SpringBootApplication (
        exclude = {
                HibernateJpaAutoConfiguration.class,
                JpaRepositoriesAutoConfiguration.class
        }
)
@EnableAspectJAutoProxy // Enable Spring AOP proxying (Spring Boot also using AutoConfiguration)

public class SuperdupermartApplication {

    public static void main(String[] args) {
        SpringApplication.run(SuperdupermartApplication.class, args);
    }
}
