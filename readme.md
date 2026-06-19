Here is your final, complete, and production-ready README.md code block. It combines everything we built with your specific folder structure, SQL dump backups, JWT key strings, and the full project guidelines.
Copy the code from the box below and paste it directly into a file named README.md in your project's root folder:

# 🌊 Sessions Marketplace (Full-Stack Mentorship Platform)
A full-stack web application designed to connect student users with expert mentors. This application features a secure Google OAuth integration, dynamic data catalogs, a mock card checkout payment engine, robust security firewalls, and custom role-based workspaces.
---## 📑 Project Folder Structure
The project code is organized into three microservices inside a centralized container system:
```text
ocean-across-assignment/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/            # Django project settings & main URLs
│   └── marketplace/       # Main Django app (Models, Views, Serializers)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/               # React components, pages, hooks, and context
│   └── public/
├── nginx/
│   ├── Dockerfile
│   └── default.conf
├── .env.example
└── docker-compose.yml
```
---## 📑 Project Overview & Architecture Blueprint
The ecosystem is built using a modern decoupled layout strategy. Containers communicate natively through an Nginx Reverse Proxy stack network link.


[ React Browser App ] --------> ( Port 80: Nginx Proxy Router Gateway )
/ 
( Routes path: /api/v1/ ) / \ ( Routes path: / )
v v
[ Django REST API Service ] [ Vite Node Web Server ]
|
[ PostgreSQL Database Volume ]


### Core Architecture Components
*   **Frontend**: React.js SPA initialized over Vite framework configurations, styled using responsive Bootstrap atomic layouts.
*   **Backend**: Django REST Framework API engine executing object queries.
*   **Database**: PostgreSQL transactional rows engine backed by persistent storage volumes.
*   **Proxy System**: Nginx gateway proxy handling cross-origin requests securely.

---

## 📑 Unified Data Model Design

The application structure is mapped inside your PostgreSQL layer using three primary tables:

### 📇 1. Custom User Model (`User`)
*   `id`: `BigAutoField` (Primary Key Key Tracker)
*   `username`: `CharField(max_length=150)` (Clean profile string name)
*   `email`: `EmailField(unique=True)` (Unique key verification index)
*   `avatar_url`: `URLField(blank=True)` (Google profile photo picture link)
*   `role`: `CharField(max_length=10, choices=[('user', 'Student'), ('creator', 'Mentor')])` (Defaults to `user` role)

### 📇 2. Catalog Course Model (`Session`)
*   `id`: `BigAutoField` (Primary Key)
*   `creator`: `ForeignKey(User, on_delete=CASCADE, related_name='sessions')` (Assigned to Creator)
*   `title`: `CharField(max_length=255)` (Mentorship workshop heading title)
*   `description`: `TextField` (Detailed curriculum information copy text)
*   `price`: `DecimalField(max_digits=10, decimal_places=2)` (Price row token value)
*   `date_time`: `DateTimeField` (Scheduled execution timestamp)
*   `created_at`: `DateTimeField(auto_now_add=True)`

### 📇 3. Marketplace Order Ledger (`Booking`)
*   `id`: `BigAutoField` (Primary Key)
*   `session`: `ForeignKey(Session, on_delete=CASCADE, related_name='bookings')`
*   `user`: `ForeignKey(User, on_delete=CASCADE, related_name='bookings')` (Attendee Student)
*   `booked_at`: `DateTimeField(auto_now_add=True)`
*   `status`: `CharField(max_length=20, default='confirmed')`
*   `payment_status`: `CharField(max_length=20, default='pending')` (Toggled to `paid` upon success)

---

## 📑 Restful API Route Endpoints Matrix

Every endpoint returns a clean `application/json` data structure package to the UI client:

| Request Method | URL Link Route Path | Authentication Level Required | Description Target Goal |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/api/v1/auth/oauth/` | Public (AllowAny view limits) | Exchanges Google Auth Code for signed backend JWTs |
| **`PATCH`** | `/api/v1/auth/profile/update/` | Authenticated (`Bearer <token>`) | Modifies user account username text and avatar picture URLs |
| **`GET`** | `/api/v1/auth/users/all/` | Creator Restricted (`role == 'creator'`) | Returns full platform users accounts database directory grid |
| **`GET`** | `/api/v1/sessions/` | Public | Downloads all published marketplace training cards slots |
| **`POST`** | `/api/v1/sessions/` | Creator Restricted (`role == 'creator'`) | Adds a new training mentorship event to the live feed |
| **`GET`** | `/api/v1/bookings/` | Authenticated (`Bearer <token>`) | Dynamic: Users see private rows; Creators see global transaction lists |
| **`POST`** | `/api/v1/bookings/` | Authenticated + Throttled | Simulates payment verification and books a mentorship slot |

---

## 📑 Secure Checkouts & Throttling Implementation

To combine robust financial safety with seamless data rendering, the app splits its throttling rules dynamically based on the incoming request type:

### Dynamic Throttling Architecture
*   **The Problem**: Applying a strict payment speed limit to the entire viewset will accidentally block creators when they load their dashboards.
*   **The Solution**: We implemented Django's `get_throttles()` method to check the request type:
    1.  When a student triggers a **`POST`** command (booking a slot), the **`payments` scope** fires, limiting checkout attempts to a maximum of **3 requests per minute** to prevent card brute-forcing.
    2.  When any user triggers a **`GET`** command (loading dashboards or menus), the view falls back to the standard **`user` scope (100 requests per minute)**. This ensures that viewing data never throws a `429 Too Many Requests` error.

---

## 📑 Installation, Setup & Docker Deployment Steps

Follow this precise execution timeline to launch the entire multi-container environment on your computer.

### 💻 Step 1: Clone and Set Up Configuration Files
Create an explicit **`.env`** configuration file inside your workspace root folder path directory. 

To generate a secure unique tracking token string value for your backend keys, you can run this command locally:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Paste the values into your environment file:
```ini
# --- Django System Settings ---
DJANGO_SECRET_KEY=YOUR_GENERATED_SECRET_KEY_HERE
DJANGO_DEBUG=True

# --- PostgreSQL Container Configuration ---
POSTGRES_DB=marketplace_db
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=secure_password_123
POSTGRES_HOST=db
POSTGRES_PORT=5432

# --- Google OAuth Security Keys ---
OAUTH_CLIENT_ID=505794165953-igbujemr4q6q9gpua2o0norsqtkf57u4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_REAL_GOOGLE_CLIENT_SECRET
```

### 💻 Step 2: Configure Your Google Cloud Firewalls
1.  Open your [Google Cloud Console Dashboard](https://google.com).
2.  Go to your OAuth Application settings.
3.  Set **Authorized JavaScript origins** exactly to: **`http://localhost`** (No trailing slash).
4.  Set **Authorized redirect URIs** exactly to: **`http://localhost/`** (Must include the trailing slash).

### 💻 Step 3: Launch Containers via Docker Compose
Open your main system command terminal deck and execute this container build pipeline:

```bash
# 1. Stop any old cached container layers and wipe volume blocks
docker-compose down -v

# 2. Build and boot the stack services in detached thread modes
docker-compose up --build -d
```

### 💻 Step 4: Run Database Initial Migrations
Push your schema logic classes straight into your live PostgreSQL active database container:

```bash
# Generate and run python migrations inside the container
docker exec -it marketplace_backend python manage.py makemigrations
docker exec -it marketplace_backend python manage.py migrate

# Optional: Create an admin account to change roles
docker exec -it marketplace_backend python manage.py createsuperuser
```

---

## 📑 Database Backup and Recovery (SQL Dump)

Use these commands to easily back up your full PostgreSQL data state or restore your mock entries for testing.

### 📥 1. Create SQL Backup Dump
Run this command from your terminal layout to export the database content directly to a `backup.sql` file on your host computer:
```bash
docker exec -t marketplace_db pg_dump -U postgres_user -d marketplace_db > backup.sql
```

### 📤 2. Restore SQL Backup Dump
To reload your saved entries, tables, and accounts into a fresh container database volume, use this command:
```bash
docker exec -i marketplace_db psql -U postgres_user -d marketplace_db < backup.sql
```

---

## 📑 Production Evaluation & Testing Guide

Once the build finishes, open your browser window to **`http://localhost/`** to test your features:

1.  **Google Sign-In Identification Flow**: Click the red login button. Because of our `prompt: 'select_account consent'` logic, it will force open Google's account selection prompt window. Choose your profile email.
2.  **Persistent Sessions**: Once logged in, refresh your page (**F5**). Your username prefix and Google avatar picture will stay visible in the header without logging you out, because your user session data is securely synchronized with **`localStorage`**.
3.  **Account Management**: Click the profile dropdown menu item choice link box and go to **Account Settings**. Type a new username or upload a photo URL, click save, and your profile details will update immediately without a page reload.
4.  **Mock Payment Gateway**: Go back home, select a session, and click **Book Now**. A secure payment checkout modal box will open on your layout screen. Type your mock card numbers, click confirm, and wait 2 seconds. The modal will verify your payment, mark the transaction as paid, and add the reservation to your **My Bookings** dashboard ledger.
5.  **Supervisor Roles**: Open **`http://localhost/api/admin/`**, log into your user rows list, and switch your account role field text dropdown from `user` to **`creator`**. Go back to your app. The home path will instantly forward you to **`/creator-dashboard`** where you can use the form panel to publish new sessions, audit every user in the platform directory, and monitor all booking transactions globally without hitting any 429 rate limit locks!

------------------------------
Your documentation is now fully customized and ready for a perfect submission!
Let me know if your Docker build runs successfully with the fresh variables file, or if you need help cleaning up any last terminal commands!

