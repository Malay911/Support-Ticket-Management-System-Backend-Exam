# Support Ticket Management System

A robust backend helpdesk system built with **NestJS**, **TypeORM**, and **MySQL**. This system allows employees to raise support tickets, support staff to manage and resolve them, and managers to oversee the entire process with granular Role-Based Access Control (RBAC).

## 🚀 Core Features

-   **Authentication & Authorization**: Secure JWT-based login and password hashing using bcrypt.
-   **Role-Based Access Control (RBAC)**: Distinct permissions for `MANAGER`, `SUPPORT`, and `USER` roles.
-   **Ticket Lifecycle Management**: Full lifecycle support: `OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`.
-   **Ticket Assignment**: Managers and support staff can assign tickets to relevant support personnel.
-   **Commenting System**: Interactive threads on tickets for collaborative troubleshooting.
-   **Audit Logging**: Automatic tracking of every status change in `TicketStatusLogs`.
-   **Input Validation**: Strict validation for ticket titles, descriptions, and enum values.
-   **Swagger Documentation**: Interactive API documentation for easy exploration.

## 🛠️ Tech Stack

-   **Framework**: [NestJS](https://nestjs.com/)
-   **Database**: MySQL
-   **ORM**: [TypeORM](https://typeorm.io/)
-   **Security**: JWT (Passport), bcrypt
-   **API Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

-   [Node.js](https://nodejs.org/) (v16.x or higher)
-   [MySQL](https://www.mysql.com/) (v8.0 or higher)
-   npm or yarn

## ⚙️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd support-ticket-management
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your MySQL credentials:
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=your_password
    DB_DATABASE=supportticket
    JWT_SECRET=secretKey
    ```

4.  **Run the application**:
    ```bash
    # Development mode
    npm run start:dev

    # Production mode
    npm run start:prod
    ```

## 🔐 Access Matrix (RBAC)

| Endpoint | Method | Roles allowed | Description |
|---|---|---|---|
| `/auth/login` | POST | Public | Login to receive JWT token |
| `/users` | POST | `MANAGER` | Create new users |
| `/users` | GET | `MANAGER` | List all users |
| `/tickets` | POST | `USER`, `MANAGER` | Create a new support ticket |
| `/tickets` | GET | `MANAGER`, `SUPPORT`, `USER` | List relevant tickets |
| `/tickets/{id}/assign` | PATCH | `MANAGER`, `SUPPORT` | Assign a ticket to a staff member |
| `/tickets/{id}/status` | PATCH | `MANAGER`, `SUPPORT` | Update ticket status |
| `/tickets/{id}` | DELETE | `MANAGER` | Delete a ticket |
| `/tickets/{id}/comments` | POST | All | Add a comment to a ticket |
| `/tickets/{id}/comments` | GET | All | List comments for a ticket |

## 📖 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/docs`

## 📂 Project Structure

```text
src/
├── auth/          # Authentication logic & JWT guards
├── tickets/       # Ticket management & Status logs
├── comments/      # Ticket commenting system
├── users/         # User management
├── roles/         # Role definitions (MANAGER, SUPPORT, USER)
├── main.ts        # Application entry point & Swagger config
└── app.module.ts  # Root module
```

## ⚖️ Business Rules

-   **Validation**: Ticket titles must be at least 5 characters; descriptions at least 10.
-   **Status Flow**: Status can only move forward: `OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`.
-   **Assignment**: Tickets can only be assigned to users with the `SUPPORT` or `MANAGER` role.
-   **Security**: All endpoints (except login) require a valid `Bearer` token in the `Authorization` header.

