# Super Duper Mart: Online Shopping Application

Welcome to Super Duper Mart, a full-stack online shopping application designed to provide a seamless experience for both customers (users) and administrators (sellers). This project is built as a monorepo, containing a Spring Boot backend and an Angular frontend.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Features](#features)
3.  [Technologies Used](#technologies-used)
4.  [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Backend Setup & Run](#backend-setup--run)
    * [Frontend Setup & Run](#frontend-setup--run)
5.  [Project Structure](#project-structure)
6.  [Backend API Documentation](#backend-api-documentation)
7.  [Contributing](#contributing)
8.  [License](#license)

## Project Overview

Super Duper Mart aims to simulate a complete e-commerce platform where users can browse products, place orders, manage watchlists, and view their purchase history. Administrators have comprehensive control over product listings, order fulfillment, and sales analytics.

## Features

### User (Customer) Features:

* **Authentication:** User registration and secure login.
* **Product Browsing:** View available products, including details (excluding sensitive info like quantity/wholesale price).
* **Shopping Cart:** Add products to a local storage-based shopping cart.
* **Order Management:** Place new orders, view all personal orders, and cancel processing orders.
* **Watchlist:** Add/remove products to a personal watchlist.
* **Purchase History:** View frequently and recently purchased items.

### Admin (Seller) Features:

* **Authentication:** Admin login.
* **Dashboard:** Overview of recent orders, top popular products, top profitable products, and total items sold.
* **Product Management:** Add new products, view/edit existing product details (including wholesale price and quantity).
* **Order Management:** View all orders (with pagination), complete processing orders, and cancel any processing order.
* **Sales Analytics:** View popular and profitable products.

## Technologies Used

### Backend:

* **Framework:** Spring Boot (v2.7.0)
* **Persistence:** Hibernate (v5.3.14.Final)
* **Database:** MySQL
* **Security:** Spring Security, JWT (JSON Web Tokens)
* **Validation:** Spring Validation (JSR 380)
* **Build Tool:** Maven
* **Language:** Java 8

### Frontend:

* **Framework:** Angular (v14.x)
* **UI Library:** Angular Material
* **State Management:** RxJS Observables
* **HTTP Client:** Angular HttpClient
* **Build Tool:** npm / Angular CLI
* **Language:** TypeScript

## Getting Started

Follow these steps to get the Super Duper Mart application up and running on your local machine.

### Prerequisites

* **Java Development Kit (JDK):** Version 8 or higher.
* **Maven:** Version 3.x or higher.
* **MySQL Database:** A running MySQL instance.
* **Node.js:** An LTS version (e.g., v18.x recommended for Angular 14). It's highly recommended to use a Node Version Manager (NVM) like `nvm` for macOS/Linux or `nvm-windows` for Windows.
* **npm:** Node Package Manager (comes with Node.js).
* **Angular CLI:** Version 14.x. Install globally: `npm install -g @angular/cli@14`
* **VS Code (Recommended IDE):** Or your preferred IDE for both Java and Angular development.

### Backend Setup & Run

1.  **Database Configuration:**
    * Create a MySQL database named `online_shopping` (or whatever you configure in `application.properties`).
    * Update `superdupermart/backend/src/main/resources/application.properties` with your MySQL credentials:
        ```properties
        database.hibernate.url=jdbc:mysql://localhost:3306/online_shopping
        database.hibernate.username=root
        database.hibernate.password=your_mysql_password
        ```
    * The `spring.jpa.hibernate.ddl-auto=update` property will automatically create/update tables on startup.

2.  **Build the Backend:**
    Navigate to the `backend` directory in your terminal:
    ```bash
    cd superdupermart/backend
    mvn clean install
    ```

3.  **Run the Backend:**
    ```bash
    mvn spring-boot:run
    ```
    The backend will start on `http://localhost:8080`. An admin user (`admin`/`adminPassword`) will be seeded on first run if not already present.

### Frontend Setup & Run

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd superdupermart/frontend
    ```

2.  **Ensure Correct Node.js Version (if using NVM):**
    ```bash
    nvm use 18 # Or the specific LTS version you installed for Angular 14
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```
    *(If you encounter issues, try `rm -rf node_modules package-lock.json` then `npm install`)*

4.  **Run the Frontend:**
    ```bash
    ng serve --open
    ```
    The frontend application will typically open in your browser at `http://localhost:4200/`.

## Project Structure

This project is organized as a monorepo:

superdupermart/
├── backend/        # Spring Boot backend application
│   ├── src/
│   ├── pom.xml
│   └── README.md   # Backend-specific documentation
└── frontend/       # Angular frontend application
├── src/
├── angular.json
├── package.json
└── README.md   # Frontend-specific documentation


## Backend API Documentation

The backend exposes a RESTful API. You can find a Postman collection (if available) or detailed endpoint descriptions in the `backend/README.md`.

## Contributing

Please refer to the `backend/README.md` and `frontend/README.md` for specific development guidelines for each part of the project.

## License

[Specify your license here, e.g., MIT, Apache 2.0, etc.]
