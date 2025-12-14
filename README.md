# QuantumCona_Assignment

🔐 Secure Real-Time Chat Application
📌 Project Description

This project is a Secure Real-Time Chat Application designed and developed to demonstrate modern full-stack development, authentication, security, and real-time communication concepts.

The application allows users to:

Register and authenticate securely

Chat one-to-one or in groups

Exchange messages in real time

Store messages in an encrypted format

Maintain sessions using Access & Refresh Tokens

The system is built with scalability, security, and clarity in mind, following real-world backend and frontend practices.

🧰 Tech Stack Used
🎨 Frontend

React (Vite)

JavaScript (ES6+)

WebSockets (native browser API)

Custom CSS (Light / Dark Theme)

Hosted on Vercel

⚙️ Backend

Django

Django REST Framework

Django Channels (WebSockets)

JWT Authentication

AES-256 Encryption

Hosted on Render

🗄️ Database

PostgreSQL (Production)

SQLite (Development)

✨ Key Features
🔑 Authentication & Authorization

Custom authentication system (no third-party auth)

Access Token

Short-lived (15 minutes)

Used to authorize APIs and WebSocket connections

Refresh Token

Long-lived (7 days)

Securely stored as HTTP-only cookie

Token rotation implemented

All protected APIs require a valid access token

💬 Chat Functionality
👤 One-to-One Chat

Users can initiate private chats

Existing chats are reused if already created

Real-time message delivery using WebSockets

👥 Group Chat

Users can create group chats

Join available public groups

Real-time group messaging

Group message history is preserved

🔒 Security & Encryption

All messages are encrypted before storing in the database

Encryption uses AES-256 (symmetric encryption)

Messages are decrypted only when sending to the client

Passwords are securely hashed using bcrypt

🏗️ System Architecture
🔷 High-Level Architecture Overview
┌──────────────────┐
│   React Client   │
│ (Vite Frontend)  │
└─────────┬────────┘
          │ HTTPS (JWT)
          ▼
┌──────────────────┐
│ Django REST APIs │
│ Authentication  │
└─────────┬────────┘
          │ WebSocket
          ▼
┌──────────────────┐
│ Django Channels  │
│ Real-time Layer │
└─────────┬────────┘
          ▼
┌──────────────────┐
│ Encrypted DB     │
│ (Messages)       │
└──────────────────┘

🔁 Authentication Lifecycle
1️⃣ Login Flow

User submits email & password

Backend validates credentials

Backend issues:

Access Token (JWT)

Refresh Token (JWT)

Access token stored in sessionStorage

Refresh token stored as HTTP-only cookie

2️⃣ API Authorization

Each protected API requires:

Authorization: Bearer <access_token>

3️⃣ Token Refresh Flow

Access token expires

Frontend sends request to /refresh/

Backend validates refresh token

Old refresh token is revoked

New access token is issued

4️⃣ Logout

Clears client session

Removes access token

Ends authenticated state

⚡ Real-Time Communication

WebSocket connection is established after login

JWT token is passed during WebSocket handshake

Each chat has a dedicated WebSocket room

Messages are instantly broadcast to all chat members

WebSocket URL Format
wss://backend-domain/ws/chat/<chat_id>/?token=<access_token>

🔐 Message Encryption Flow
Encryption Type

AES-256 (Symmetric Encryption)

Where Encryption Happens
Step	Location
Encrypt message	Backend (before DB save)
Store message	Database (encrypted)
Decrypt message	Backend (before sending to client)
Why This Approach?

Prevents plaintext data storage

Protects data in case of database breach

Keeps encryption logic centralized and secure

🗄️ Database Design (Simplified)
Users

Userid

Username

Email

Password (hashed)

Chat

id

is_group

name

created_by

created_at

ChatMember

chat

user

Message

id

chat

sender

encrypted_text

created_at

RefreshToken

user

token_hash

expires_at

is_revoked

🔌 API Endpoints (Overview)
Authentication

POST /login/

POST /refresh/

POST /reg_user/

Chat

POST /chat/create/

POST /chat/private/

GET /chat/list/

GET /chat/explore/

POST /chat/<chat_id>/add/

GET /chat/<chat_id>/history/

⚙️ Setup Instructions
Backend Setup
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend Setup
npm install
npm run dev

🚀 Deployment
Backend

Deployed on Render

HTTPS enabled

CORS configured for Vercel frontend

Frontend

Deployed on Vercel

Uses environment variables for backend URL

SPA routing configured

⚖️ Technical Decisions & Trade-offs
JWT Authentication

✅ Stateless and scalable
❌ Requires careful token expiration handling

WebSockets

✅ Instant message delivery
❌ Persistent connections required

Server-Side Encryption

✅ Strong data protection
❌ Slight processing overhead

🔮 Future Enhancements

Typing indicators

Online/offline status

Message read receipts

Admin roles in groups

Media/file sharing

🌍 Live Application

Frontend (Vercel):
👉 https://quantum-cona-assignmentchat.vercel.app

Backend (Render):
👉 https://quantumcona-assignment.onrender.com

🎥 Demo Video

Unlisted YouTube Video:
👉 Add video link

🏁 Conclusion

This project demonstrates a production-ready secure chat system using modern web technologies.
It reflects strong understanding of authentication, security, real-time systems, and clean UI design, aligning closely with real-world software engineering practices.
