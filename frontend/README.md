# Super Duper Mart - Frontend

This directory contains the Angular frontend application for the Super Duper Mart online shopping platform. It provides the user interface for interacting with the backend API.

## Table of Contents

1.  [Technologies](#technologies)
2.  [Setup & Run](#setup--run)
3.  [Project Structure](#project-structure)
4.  [Key Features Implemented](#key-features-implemented)
5.  [Development Guidelines](#development-guidelines)

## Technologies

* **Framework:** Angular (v14.x)
* **UI Library:** Angular Material (for responsive and modern UI components)
* **HTTP Client:** Angular's `HttpClient` for API communication.
* **State Management:** RxJS Observables for reactive programming and local storage for shopping cart persistence.
* **Routing:** Angular Router for single-page application navigation.
* **Build Tool:** npm / Angular CLI
* **Language:** TypeScript
* **Code Formatting:** Prettier (recommended VS Code extension)

## Setup & Run

Refer to the main [README.md](../README.md) in the project root for overall prerequisites and how to set up and run the frontend.

### Development Server

Run `ng serve --open` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Project Structure

The Angular application follows a modular structure:

src/app/
├── admin/          # Admin-specific components and routing
│   ├── components/
│   └── admin-routing.module.ts
├── auth/           # Authentication (Login, Register) components and routing
│   ├── components/
│   └── auth-routing.module.ts
├── core/           # Core services, guards, and interceptors (e.g., AuthService, AuthGuard, AuthInterceptor)
│   ├── guards/
│   ├── interceptors/
│   └── services/
├── shared/         # Shared components, services, models, and Angular Material modules
│   ├── components/
│   ├── models/     # TypeScript interfaces mirroring backend DTOs
│   └── services/
│   └── shared.module.ts
├── user/           # User-specific components and routing
│   ├── components/
│   └── user-routing.module.ts
├── app-routing.module.ts # Main application routes
├── app.component.* # Root application component
└── app.module.ts           # Root application module

## Key Features Implemented

### Authentication & Authorization

* Login and Registration forms with Angular Material and Reactive Forms.
* JWT token handling (storage in Local Storage, attachment via `AuthInterceptor`).
* Role-based navigation (`isAdmin()` checks in `app.component.html`).
* Route protection using `AuthGuard` (for authenticated users and admin-only routes).

### User Features

* **Product List:** Displays available products in a Material table.
* **Product Detail:** Shows product information, conditionally hiding sensitive data for users.
* **Shopping Cart:** In-memory cart with local storage persistence.
* **Watchlist:** Add/remove products from a watchlist.
* **Order List:** Displays user's orders in a Material table.
* **Order Detail:** Shows detailed order information, including items.
* **User Home:** Displays frequently and recently purchased products.

### Admin Features

* **Admin Dashboard:** Displays recent orders, top popular/profitable products, and total items sold.
* **Product Management:** Lists all products in a Material table with options to view/edit.
* **Add/Edit Product Forms:** Reactive forms for managing product details.
* **Order Management:** Lists all orders in a Material table with pagination, and actions to complete/cancel.

## Development Guidelines

* **Modular Design:** Application is organized into feature modules (`AuthModule`, `UserModule`, ``AdminModule`, `CoreModule`, `SharedModule`).
* **Reactive Forms:** Used for all complex forms for better validation and control.
* **Services:** All API interactions are encapsulated within Angular Services.
* **Angular Material:** Used for consistent and responsive UI components.
* **Error Handling:** HTTP Interceptors catch API errors and display user-friendly notifications using `MatSnackBar`.
* **Code Style:** Adheres to Angular's style guide and uses Prettier for formatting.
