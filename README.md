# Mini SIP Tracker - FastAPI Backend & React Frontend

This project implements a Mini Systematic Investment Plan (SIP) Tracker, consisting of a FastAPI backend and a React frontend. It allows users to set up and track their monthly mutual fund SIPs, featuring user authentication via Supabase JWT and data persistence in a Supabase PostgreSQL database.

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Features](#2-features)
3.  [Tech Stack](#3-tech-stack)
4.  [Setup Instructions](#4-setup-instructions)
    * [4.1. Prerequisites](#41-prerequisites)
    * [4.2. Supabase Setup](#42-supabase-setup)
    * [4.3. Backend Setup](#43-backend-setup)
    * [4.4. Frontend Setup](#44-frontend-setup)
5.  [Running the Application](#5-running-the-application)
    * [5.1. Start Backend](#51-start-backend)
    * [5.2. Start Frontend](#52-start-frontend)
6.  [API Usage](#6-api-usage)
    * [6.1. Obtain JWT Token (Frontend Login)](#61-obtain-jwt-token-frontend-login)
    * [6.2. Create SIP Plan (`POST /sips/`)](#62-create-sip-plan-post-sips)
    * [6.3. Get SIP Summary (`GET /sips/summary`)](#63-get-sip-summary-get-sips-summary)
7.  [Project Walkthrough](#7-project-walkthrough)
    * [7.1. Backend Architecture](#71-backend-architecture)
    * [7.2. Frontend Architecture](#72-frontend-architecture)
    * [7.3. Authentication Flow](#73-authentication-flow)
    * [7.4. Data Flow](#74-data-flow)
8.  [System Design Considerations (Scalability)](#8-system-design-considerations-scalability)

---

## 1. Project Overview

This project addresses the core requirements of a backend assignment for a fintech application focusing on SIP tracking. It showcases API development, data modeling, and robust authentication using Supabase. The application is split into two main parts: a FastAPI backend that handles business logic and database interactions, and a React frontend that provides a user interface for interaction.

## 2. Features

* **User Authentication**: Secure user login via Supabase JWT.
* **SIP Plan Creation**: Authenticated users can create new monthly SIP plans.
* **SIP Summary**: View a summary of active SIPs, grouped by scheme, showing total invested amount and months invested.
* **Scalable Architecture**: Designed with considerations for future scaling and feature expansion.

## 3. Tech Stack

**Backend:**
* **Framework**: FastAPI
* **Authentication**: Supabase JWT
* **Database**: Supabase PostgreSQL
* **ORM**: SQLAlchemy
* **Password Hashing**: Passlib (Bcrypt)
* **Environment Management**: `python-dotenv`
* **Database Driver**: `psycopg2-binary`

**Frontend:**
* **Framework**: React (with TypeScript)
* **Build Tool**: Vite
* **Supabase Integration**: `@supabase/supabase-js` (Official JS client)
* **State Management**: React Context API

---

## 4. Setup Instructions

Follow these steps to get the project running on your local machine.

### 4.1. Prerequisites

* Python 3.10+
* Node.js (LTS recommended) & npm (or yarn)
* Git
* A Supabase Project (Free tier is sufficient)

### 4.2. Supabase Setup

1.  **Create a Supabase Project**:
    * Go to [Supabase](https://app.supabase.io/) and create a new project.
2.  **Database Configuration**:
    * Navigate to **Project Settings** (gear icon) > **Database**.
    * Under "Connection string", copy the **URI** tab's value. This will be your `DATABASE_URL`.
    * Ensure "Network Restrictions" are set to **"Allow all IPs"** for development/deployment.
3.  **Authentication Configuration**:
    * Navigate to **Project Settings** (gear icon) > **API**.
    * Find your **"Project URL"** (e.g., `https://your-project-ref.supabase.co`). This will be your `SUPABASE_URL`.
    * Find your **"Project API key (public)"** (anon key). This will be your `SUPABASE_ANON_KEY`.
    * Find your **"JWT Secret"**. This will be your `SUPABASE_JWT_SECRET`. **Copy this value meticulously, without any surrounding quotes.**
4.  **Create a Test User**:
    * Go to **Authentication** > **Users**.
    * Click "Invite user" or "Create user" and create a user with an email and password. This user will be used for testing login.

### 4.3. Backend Setup

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd sip_tracker # Navigate to the root directory of the backend
    ```
2.  **Create a Python Virtual Environment**:
    ```bash
    python -m venv venv
    ```
3.  **Activate the Virtual Environment**:
    * **macOS/Linux**: `source venv/bin/activate`
    * **Windows (CMD)**: `venv\Scripts\activate.bat`
    * **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
4.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Create `.env` file**:
    * In the root of your backend project (`sip_tracker/`), create a file named `.env`.
    * Add your Supabase credentials to this file. **Ensure `SUPABASE_JWT_SECRET` is NOT wrapped in quotes here.**

    ```dotenv
    # sip_tracker/.env
    DATABASE_URL=""
    SUPABASE_JWT_SECRET=""
    SUPABASE_URL=""
    SUPABASE_ANON_KEY=""
    ```
    **Important**: Replace the example values above with your *actual* Supabase project credentials.

### 4.4. Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install Node.js Dependencies**:
    ```bash
    npm install
    ```
3.  **Create `.env` file for Frontend**:
    * In the root of your frontend project (`sip_tracker/frontend/`), create a file named `.env`.
    * Add your Supabase credentials to this file. **Note the `VITE_` prefix for Vite environment variables.**

    ```dotenv
    # sip_tracker/frontend/.env
    VITE_SUPABASE_URL=
    VITE_SUPABASE_ANON_KEY=
    ```
    **Important**: Replace the example values above with your *actual* Supabase project URL and Anon Key.

---

## 5. Running the Application

Ensure both backend and frontend are running simultaneously.

### 5.1. Start Backend

1.  Navigate to the backend root directory: `cd sip_tracker`
2.  Activate virtual environment: `source venv/bin/activate` (or `venv\Scripts\activate.bat`)
3.  Run the FastAPI application with Uvicorn:
    ```bash
    uvicorn app.main:app --reload
    ```
    * This will typically run on `http://127.0.0.1:8000`.
    * During startup, it will attempt to connect to Supabase and create database tables if they don't exist. Monitor the console for `Application startup complete.` and any error messages.

### 5.2. Start Frontend

1.  Open a **new terminal window/tab**.
2.  Navigate to the frontend directory: `cd sip_tracker/frontend`
3.  Run the Vite development server:
    ```bash
    npm run dev
    ```
    * This will typically run on `http://localhost:5173` (or another available port). Your browser should automatically open to this address.

---

## 6. API Usage

Once both backend and frontend are running, you can interact with the application.

### 6.1. Obtain JWT Token (Frontend Login)

1.  Open your browser to the frontend URL (e.g., `http://localhost:5173`).
2.  Enter the email and password of the user you created in your Supabase project (from Setup step 4.2).
3.  Click the "Sign In" button.
4.  On successful login, you will see a "Logged In!" message, your Supabase User ID (UUID), and the JWT Access Token displayed directly in the UI. This token is automatically used by the frontend for subsequent API calls.

### 6.2. Create SIP Plan (`POST /sips/`)

* **Endpoint**: `POST /sips/`
* **Authentication**: Requires a valid JWT in the `Authorization: Bearer <token>` header (handled automatically by the frontend after login).
* **Request Body (JSON)**:
    ```json
    {
      "scheme_name": "Parag Parikh Flexi Cap",
      "monthly_amount": 5000,
      "start_date": "2024-01-01"
    }
    ```
* **Usage**: Fill out the "Create New SIP Plan" form on the frontend and click "Add SIP Plan".
* **Expected Response**: `201 Created` with the details of the newly created SIP plan. The backend will automatically create a user profile in its `public.users` table if one doesn't exist for the authenticated user's UUID.

### 6.3. Get SIP Summary (`GET /sips/summary`)

* **Endpoint**: `GET /sips/summary`
* **Authentication**: Requires a valid JWT (handled automatically by the frontend).
* **Usage**: This endpoint is automatically called by the `SIPSummaryList` component when the user logs in. You can click the "Get Summary" button (if added) or just observe the list.
* **Expected Response**: `200 OK` with a list of SIP summaries, grouped by scheme:
    ```json
    [
      {
        "scheme_name": "Parag Parikh Flexi Cap",
        "total_invested": 25000,
        "months_invested": 5
      }
    ]
    ```

---

## 7. Project Walkthrough

### 7.1. Backend Architecture (`sip_tracker/app/`)

* **`main.py`**: The FastAPI application entry point.
    * Initializes the `FastAPI` app.
    * Configures `CORSMiddleware` to allow requests from the React frontend.
    * Uses a `lifespan` event handler to call `create_db_and_tables()` on startup, ensuring database schema is synced.
    * Includes API routers from `app.api.users` and `app.api.sips`.
* **`database.py`**:
    * Configures the SQLAlchemy engine and `SessionLocal` for connecting to Supabase PostgreSQL using `DATABASE_URL` from environment variables.
    * Defines `Base` for SQLAlchemy declarative models.
    * `create_db_and_tables()`: Function to create all tables defined in `models.py` in the database.
    * `get_db()`: A FastAPI dependency to provide a database session for each request.
* **`models.py`**:
    * Defines SQLAlchemy ORM models (`User` and `SIP`) that map to your PostgreSQL tables.
    * `User.id` and `SIP.owner_id` are `String` types to accommodate Supabase's UUIDs.
    * Includes relationships (`User.sips`, `SIP.owner`).
* **`schemas.py`**:
    * Defines Pydantic models for request and response data validation and serialization.
    * Includes `UserBase`, `UserCreate`, `User`, `SipPlanBase`, `SipPlanCreate`, ``SipPlanResponse`, and `SipSummary`.
    * Ensures `owner_id` in `SipPlanResponse` is `str`.
* **`crud.py`**:
    * Contains C(reate)R(ead)U(pdate)D(elete) operations for interacting with the database.
    * `create_user()`: For a hypothetical user registration in `public.users` (not directly used by Supabase auth).
    * `get_user_by_username()`: For looking up users.
    * `get_or_create_user_profile()`: **Crucially**, this function ensures that a corresponding profile exists in your `public.users` table for every authenticated Supabase user. It creates the record if it doesn't exist, preventing foreign key violations.
    * `create_sip_plan()`: Inserts a new SIP record into the database.
    * `get_user_sips()`: Fetches all SIPs for a given user.
    * `get_sip_summary()`: Aggregates SIP data to provide a summary.
* **`auth.py`**:
    * Handles Supabase JWT token verification.
    * `SUPABASE_JWT_SECRET` is loaded from environment variables.
    * `get_current_user()`: A FastAPI dependency that extracts the JWT from the `Authorization` header, decodes it using `python-jose`, validates it, and returns the authenticated user's UUID.
* **`api/` directory**:
    * **`users.py`**: Defines API endpoints related to users (e.g., `POST /users/`). Currently, it's protected and can create user profiles (though `get_or_create_user_profile` handles the main sync).
    * **`sips.py`**: Defines API endpoints for SIP management (`POST /sips/`, `GET /sips/summary`). These endpoints use `Depends(get_current_user)` to ensure authentication and `get_or_create_user_profile` to guarantee user profile existence before data operations.

### 7.2. Frontend Architecture (`frontend/src/`)

* **`main.tsx`**: The entry point for the React application, rendering the `App` component into the DOM.
* **`App.tsx`**:
    * Wraps `AppContent` with `AuthProvider` to make authentication state globally available.
    * `AppContent` conditionally renders the `SignIn` component when not authenticated, and `SIPForm` and `SIPSummaryList` when authenticated.
* **`supabaseClient.ts`**:
    * Initializes the `@supabase/supabase-js` client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from frontend environment variables.
    * Ensures correct TypeScript typing for the `supabase` instance.
* **`context/AuthContext.tsx`**:
    * Uses React Context API to manage authentication state (`session`, `user`, `loading`).
    * Provides `signIn` and `signOut` functions that wrap Supabase client methods.
    * Listens for `onAuthStateChange` events from Supabase to keep the app's auth state updated.
    * `useAuth()`: A custom hook to conveniently access auth state from any component.
* **`components/SignIn.tsx`**:
    * A simple form for user email and password input.
    * Uses `useAuth()` to call the `signIn` function provided by `AuthContext`.
    * Displays login status, errors, and the obtained JWT upon successful login.
* **`apiService.ts`**:
    * A utility file for making API calls to the FastAPI backend.
    * `callApi()`: A generic function that takes an endpoint, method, the current Supabase `Session`, and optional data. It automatically attaches the `Authorization: Bearer` header using the session's `access_token`.
    * `createSip()`: Calls `POST /sips/` via `callApi()`.
    * `getSipSummary()`: Calls `GET /sips/summary` via `callApi()`.
    * Defines TypeScript interfaces for API request/response structures (`SipPlanCreate`, `SipPlanResponse`, `SipSummary`).
* **`components/SIPForm.tsx`**:
    * A form component for entering SIP details (`scheme_name`, `monthly_amount`, `start_date`).
    * Uses `useAuth()` to get the current `session` and `createSip()` from `apiService.ts` to send data to the backend.
* **`components/SIPSummaryList.tsx`**:
    * Fetches and displays the user's SIP summary.
    * Uses `useEffect` and `getSipSummary()` from `apiService.ts` to fetch data when the component mounts or the session changes.

### 7.3. Authentication Flow

1.  **Frontend Login**: User enters email/password in `SignIn.tsx`.
2.  **Supabase Auth**: `supabase.auth.signInWithPassword()` is called (via `AuthContext.signIn`). Supabase authenticates the user and returns a `session` object containing a JWT `access_token` and `user` data.
3.  **Frontend State Update**: `AuthContext` updates its `session` and `user` states. The UI reflects the logged-in state, showing the JWT.
4.  **Authenticated API Call**: User initiates a request (e.g., "Add SIP Plan" in `SIPForm.tsx`).
5.  **`apiService` Interception**: `apiService.callApi()` receives the Supabase `session` and extracts the `session.access_token`.
6.  **`Authorization` Header**: The `apiService` attaches this token as `Authorization: Bearer <JWT_TOKEN>` to the HTTP request sent to FastAPI.
7.  **FastAPI `get_current_user`**: On the backend, the `get_current_user` dependency (in `app/auth.py`) intercepts the request.
8.  **JWT Validation**: It extracts the token, uses `python-jose` to `jwt.decode` the token against the `SUPABASE_JWT_SECRET` loaded from FastAPI's environment. This step also verifies claims like `exp` (expiration).
9.  **User ID Injection**: If validation succeeds, `get_current_user` returns the user's Supabase UUID (`payload.get("sub")`). This UUID is then injected into the endpoint function (e.g., `create_sip(..., current_user_id: str)`).
10. **User Profile Sync**: Before performing database operations (e.g., creating a SIP), `get_or_create_user_profile()` ensures a corresponding profile record exists in the backend's `public.users` table for this `current_user_id` (UUID). This prevents foreign key violations.
11. **Database Operation**: The backend proceeds to perform the requested database operation (e.g., creating a SIP plan, linked by `owner_id` to the `public.users` table record).

### 7.4. Data Flow

* **Client to Backend**: Pydantic models (e.g., `SipPlanCreate`) ensure strict validation of incoming request data.
* **Backend to Database**: SQLAlchemy ORM models (`models.User`, `models.SIP`) abstract direct SQL queries, ensuring data consistency and type mapping.
* **Database to Backend**: SQLAlchemy retrieves data from PostgreSQL, which is then mapped back to ORM models.
* **Backend to Client**: Pydantic response models (e.g., `SipPlanResponse`, `SipSummary`) serialize Python objects into JSON and ensure the response structure is consistent and validated before sending to the frontend.

---

## 8. System Design Considerations (Scalability)

* For detailed system design considerations regarding scalability to 10 million users, real-time NAVs, analytics, caching, background tasks, security, multi-tenancy, and microservices, please refer to the separate `design.md` or `.pdf` document.

---

This README provides a comprehensive guide for anyone looking to understand, set up, and run your Mini SIP Tracker project.
