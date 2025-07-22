# Super Duper Mart - Backend

This directory contains the Spring Boot backend application for the Super Duper Mart online shopping platform. It provides the RESTful API endpoints for user authentication, product management, order processing, and administrative analytics.

## Table of Contents

1.  [Technologies](#technologies)
2.  [Setup & Run](#setup--run)
3.  [Database Schema (ERD Overview)](#database-schema-erd-overview)
4.  [API Endpoints](#api-endpoints)
5.  [Security](#security)
6.  [Exception Handling](#exception-handling)
7.  [AOP (Aspect-Oriented Programming)](#aop-aspect-oriented-programming)
8.  [Development Guidelines](#development-guidelines)

## Technologies

* **Framework:** Spring Boot (v2.7.0)
* **Persistence:** Hibernate (v5.3.14.Final)
    * Uses HQL and Criteria API for DAO implementations.
    * No Spring Data JPA Repositories (JpaRepository/CrudRepository) are used.
* **Database:** MySQL
* **Security:** Spring Security with JWT (JSON Web Tokens) for authentication and role-based authorization.
* **Validation:** Jakarta Bean Validation (JSR 380) for input validation.
* **Build Tool:** Maven
* **Language:** Java 8
* **Logging:** SLF4J with Logback (default Spring Boot logging)
* **CORS:** Configured to allow requests from `http://localhost:4200` (frontend development server).

## Setup & Run

Refer to the main [README.md](../README.md) in the project root for overall prerequisites and how to set up and run the backend.

### Database Configuration

* **Database Name:** `online_shopping` (configurable in `application.properties`).
* **User/Password:** Configured in `application.properties`.
* **Schema Generation:** `spring.jpa.hibernate.ddl-auto=update` is set in `application.properties` to automatically create/update table schemas on application startup.

### Data Seeding

* An `admin` user with username `admin` and password `adminPassword` is automatically seeded into the database on the first application startup via `DataInitializer` if it doesn't already exist.

## Database Schema (ERD Overview)

(You can describe your main entities and their relationships here, or link to an ERD image if you have one.)

* **User:** Stores customer and admin accounts (username, email, password, role).
* **Product:** Stores product details (name, description, wholesale price, retail price, quantity).
* **Order:** Represents a customer's order (user, status, creation timestamp, list of order items).
* **OrderItem:** Details of a specific product within an order (product snapshot details, quantity). This captures price at time of purchase.
* **Watchlist:** Links users to products they are watching.

## API Endpoints

The backend exposes a RESTful API. Below is a summary of key endpoints. For detailed request/response bodies, refer to the Postman Collection (if available).

### Authentication

* `POST /signup`: Register a new user.
* `POST /login`: Authenticate a user and receive a JWT token.

### Products (Public/User Access)

* `GET /products/all`: Get a list of all in-stock products (requires authentication).
* `GET /products/{id}`: Get details of a specific product (requires authentication).

### Orders (User Access)

* `POST /orders`: Place a new order (requires authentication).
* `GET /orders/all`: Get all orders for the authenticated user.
* `GET /orders/{id}`: Get details of a specific order (requires authentication, user must own order or be admin).
* `PATCH /orders/{orderId}/cancel`: Cancel a processing order (requires authentication, user must own order or be admin).

### Watchlist (User Access)

* `GET /watchlist/products/all`: Get all in-stock products in the authenticated user's watchlist.
* `POST /watchlist/product/{productId}`: Add a product to the authenticated user's watchlist.
* `DELETE /watchlist/product/{productId}`: Remove a product from the authenticated user's watchlist.

### Products (Admin Access)

* `POST /products`: Add a new product (ADMIN role required).
* `PATCH /products/{id}`: Update an existing product (ADMIN role required).
* `GET /products/popular/{x}`: Get top X most popular products (ADMIN role required).
* `GET /products/profit/{x}`: Get top X most profitable products (ADMIN role required).

### Orders (Admin Access)

* `GET /orders/admin`: Get all orders with pagination (ADMIN role required).
* `PATCH /orders/{orderId}/complete`: Mark a processing order as completed (ADMIN role required).
* `GET /orders/admin/total-sold-items`: Get the total count of items sold from completed orders (ADMIN role required).

## Security

* **JWT (JSON Web Tokens):** Used for stateless authentication. Tokens are issued upon successful login and must be included in the `Authorization: Bearer <token>` header for protected endpoints.
* **Spring Security:** Configured to secure endpoints based on authentication status (`authenticated()`) and user roles (`hasRole('ADMIN')`).
* **CORS Configuration:** A global CORS configuration (`CorsConfig`) is applied to allow cross-origin requests from the frontend development server (`http://localhost:4200`). This is integrated with Spring Security to correctly handle `OPTIONS` preflight requests.

## Exception Handling

* A global exception handler (`GlobalExceptionHandler` using `@ControllerAdvice`) is implemented to provide consistent and user-friendly error responses (JSON format) for various exceptions, including:
    * `InvalidCredentialsException` (401 Unauthorized)
    * `NotEnoughInventoryException` (409 Conflict)
    * `AccessDeniedException` (403 Forbidden)
    * `MethodArgumentNotValidException` (400 Bad Request for validation errors)
    * General `Exception` (400 Bad Request)

## AOP (Aspect-Oriented Programming)

* An `AuditAspect` is implemented to demonstrate AOP concepts by logging sensitive administrative actions (product creation/update, order completion/cancellation). This uses `@Before`, `@AfterReturning`, `@AfterThrowing`, and `@Around` advice types.

## Development Guidelines

* **Layered Architecture:** The project follows a strict layered architecture (`@RestController`, `@Service`, `@Repository`).
* **No Spring Data JPA:** DAOs interact directly with Hibernate SessionFactory.
* **Transaction Management:** All service methods that modify data or require lazy loading are annotated with `@Transactional`.