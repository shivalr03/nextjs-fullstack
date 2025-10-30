
# Project Documentation

## 1. Project Overview

This project is a full-stack application built with Next.js. It appears to be an inventory management system where users can add, view, and manage products. The application includes features like user authentication, a dashboard for analytics, and a database to persist product information. It is designed to provide a comprehensive solution for tracking and managing inventory, with a clear separation of concerns between the frontend and backend.

## 2. Tech Stack

*   **Language:** TypeScript
*   **Framework:** Next.js
*   **UI Library:** React
*   **Styling:** Tailwind CSS
*   **Database ORM:** Prisma
*   **Authentication:** @stackframe/stack
*   **Data Validation:** Zod
*   **Icons:** lucide-react
*   **Charting:** recharts

## 3. Directory Structure

```
/app                # Main application source code, following Next.js App Router structure
├── /add-product    # Page for adding a new product
├── /dashboard      # Dashboard page for displaying analytics
├── /handler        # API handler for Stackframe authentication
├── /inventory      # Page for listing and managing inventory
├── /settings       # Page for user settings
├── /sign-in        # Sign-in page for user authentication
/components         # Reusable React components
/lib                # Core application logic
├── /actions        # Server-side actions for data manipulation
/prisma             # Prisma schema, database client, and migrations
/public             # Static assets like images and SVGs
/stack              # Stackframe client and server configuration
next.config.ts      # Next.js configuration
package.json        # Project dependencies and scripts
tsconfig.json       # TypeScript configuration
```

## 4. Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nextjs-fullstack
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    This project uses Prisma for database management.
    *   Make sure you have a PostgreSQL database running.
    *   Create a `.env` file in the root of the project and add the `DATABASE_URL`:
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
        ```
    *   Run the database migrations:
        ```bash
        npx prisma migrate dev
        ```
    *   Seed the database with initial data:
        ```bash
        npx prisma db seed
        ```

4.  **Set up authentication:**
    This project uses Stackframe for authentication. You will need to sign up for a Stackframe account and get your project credentials. Add them to your `.env` file.
    ```
    STACK_SECRET_KEY="your-stack-secret-key"
    NEXT_PUBLIC_STACK_PUBLISHABLE_KEY="your-stack-publishable-key"
    ```

## 5. Running the Project

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 6. Core Modules & Functionality

### File: `lib/prisma.ts`

*   **Purpose:** This file initializes and exports a singleton instance of the Prisma client. This ensures that there is only one instance of Prisma Client running in the application, which is a best practice for performance and connection management.

### File: `lib/auth.ts`

*   **Purpose:** This file configures and exports authentication-related utilities using `@stackframe/stack`. It defines the authentication system for the Next.js application.
*   **Key Functions/Classes:**
    *   `stackServerApp`: An instance of the Stack server-side client, used for handling authentication logic on the server.

### File: `lib/actions/product.ts`

*   **Purpose:** This file contains server-side actions related to product management. These actions are used to interact with the database and perform CRUD (Create, Read, Update, Delete) operations on products.
*   **Key Functions/Classes:**
    *   `addProduct(data: FormData)`: A server action that creates a new product in the database. It uses Zod for form data validation.

### File: `prisma/schema.prisma`

*   **Purpose:** This file defines the database schema using the Prisma schema language. It includes the models for `User` and `Product`.
*   **Key Models:**
    *   `User`: Represents a user of the application.
    *   `Product`: Represents a product in the inventory, with fields like `name`, `description`, `price`, and `quantity`. It has a relationship with the `User` model.

## 7. API Reference

The application uses Next.js Server Actions for most of its backend logic. However, it exposes an API route for Stackframe authentication.

| Method | Endpoint                  | Description                                |
| :----- | :------------------------ | :----------------------------------------- |
| `ANY`  | `/handler/[...stack]`     | Handles all authentication-related requests from the Stackframe client, such as sign-in, sign-up, and session management. |

## 8. Running Tests

There are no testing frameworks configured in this project yet. To run the linter, use:

```bash
npm run lint
```
