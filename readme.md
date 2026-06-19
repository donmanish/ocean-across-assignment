# Sessions Marketplace (Full-Stack Mentorship Platform)
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
## 📑 Project Overview & Architecture Blueprint
The ecosystem is built using a modern decoupled layout strategy. Containers communicate natively through an Nginx Reverse Proxy stack network link.


    [ React Browser App ] --------> ( Port 80: Nginx Proxy Router Gateway )
    / 
    ( Routes path: /api/v1/ ) / \ ( Routes path: / )
    [ Django REST API Service ] [ Vite Node Web Server ]
    |
    [ PostgreSQL Database Volume ]


### Core Architecture Components
*   **Frontend**: React.js SPA initialized over Vite framework configurations, styled using responsive Bootstrap atomic layouts.
*   **Backend**: Django REST Framework API engine executing object queries.
*   **Database**: PostgreSQL transactional rows engine backed by persistent storage volumes.
*   **Proxy System**: Nginx gateway proxy handling cross-origin requests securely.

---

## 📑 Class Design

- User 

    - id: BigAutoField [PK]                                               
    - username: CharField                                                 
    - email: EmailField                                                   
    - role: CharField (choices: 'user', 'creator'; default: 'user')       
    - avatar_url: URLField (blank=True, null=True)                        
    - is_staff: BooleanField                                              
    - is_active: BooleanField                                             
    - date_joined: DateTimeField                                          
           

- Session                                 

    - id: BigAutoField [PK]                                               
    - creator: ForeignKey [FK -> User.id]                                 
    - title: CharField                                                  
    - description: TextField                                              
    - price: DecimalField(max_digits=10, decimal_places=2)              
    - created_at: DateTimeField(auto_now_add=True)                       


- Booking                                 

    - id: BigAutoField [PK]                                               
    - session: ForeignKey [FK -> Session.id]                              
    - user: ForeignKey [FK -> User.id] (related_name: 'bookings')          
    - booked_at: DateTimeField(auto_now_add=True)                         
    - status: CharField (choices: 'confirmed', 'cancelled')               
    - payment_status: CharField (choices: 'pending', 'paid')  

### class realtionship

User ───► Session (1 : N)
Session ───► Booking (1 : N)
User ───► Booking (1 : N):



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

## 📑 Secure Checkouts & Throttling Implementation (Rate limiting)

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
# --- General Config ---
ENVIRONMENT=development

# --- Database (PostgreSQL inside Docker) ---
POSTGRES_DB=marketplace_db
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=db
POSTGRES_PORT=5432


# --- Backend (Django) ---
DJANGO_SECRET_KEY=django-insecure-%en*%0tj(a=(i858)==9#@=0jc7aw+ul*$okq@394z1xsdf7w9
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend

# --- JWT Settings ---
JWT_SECRET_KEY=your_jwt_secret_key_here

# --- OAuth Credentials (Google / GitHub) ---
OAUTH_CLIENT_ID=your_oauth_client_id_here
OAUTH_CLIENT_SECRET=your_oauth_client_secret_here

# --- Frontend (Vite + React)---
VITE_API_URL=http://localhost/api/v1/
```

### 💻 Step 2: Configure Your Google Cloud Firewalls
1.  Open your [Google Cloud Console Dashboard](https://google.com).
2.  OAuth2.0 clientId
3.  Go to your OAuth Application settings.
4.  Set **Authorized JavaScript origins** exactly to: **`http://localhost`** (No trailing slash).
5.  Set **Authorized redirect URIs** exactly to: **`http://localhost/`** (Must include the trailing slash).
6. Get CliendId and client secret key

### 💻 Step 3: Launch Containers via Docker Compose
Open your main system command terminal deck and execute this container build pipeline:

```bash
# 1. Stop any old cached container layers and wipe volume blocks
docker-compose down -v

# 2. Build and boot the stack services in detached thread modes
docker-compose up --build -d
```

## 📑 Database Backup and Recovery (SQL Dump)

Use these commands to easily back up your full PostgreSQL data state or restore your mock entries for testing.


### 📤 2. Restore SQL Backup Dump which is in main folder ocean-across-assigment/backup.sql
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