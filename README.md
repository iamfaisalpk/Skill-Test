🚀 Skill Test – mini e-commerce application (Next.js)
📌 Project Overview

This project is a Next.js (App Router) based web application implementing an OTP-based authentication flow along with a product purchase and order management system.

The application demonstrates:

Phone number based login using OTP

Automatic user registration for new users

JWT-based authentication

Protected routes

Product listing and purchase flow

User order history

📌 Note: Static OTP generation is used for testing purposes as mentioned in the task requirements.

🌍 Live Demo

🔗 Deployed Application:
👉 https://skill-test-navy.vercel.app/

🛠 Tech Stack

Frontend

Next.js 16 (App Router)

React 19

TypeScript

Tailwind CSS

State Management

Zustand

Networking

Axios

UI & UX

React Phone Number Input

React Toastify (notifications)

Lucide Icons

GSAP (animations)

Authentication

JWT (stored in localStorage)

🔐 Authentication Flow

User enters phone number

A static OTP is generated and shown (for testing)

User enters OTP

Existing User

Logged in directly

New User

Asked to enter name

Automatically registered

JWT token stored in localStorage

User redirected to homepage

Protected pages are accessible only after login.

🧾 Features

OTP-based login (phone number)

Auto registration for new users

JWT authentication

Protected routes

Product listing (SSR)

Buy Now purchase flow

User order history

Logout functionality

Responsive UI

📦 API Integration

The following APIs are integrated as provided:

POST /api/verify/ – OTP verification

POST /api/login-register/ – User registration

POST /api/purchase-product/ – Buy product (JWT required)

GET /api/user-orders/ – User order history

GET /api/new-products/ – Latest products

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/iamfaisalpk/Skill-Test.git
cd Skill-Test

2️⃣ Install Dependencies
npm install

3️⃣ Run Development Server
npm run dev


Application will run at:

http://localhost:3000

🧠 Technical Decisions

Static OTP used for easier testing (no SMS service required)

Zustand chosen for lightweight and clean state management

App Router + SSR for better performance and SEO

JWT stored in localStorage for simplicity

Clean separation of concerns using services, hooks, and components

📁 Project Structure
app/
├── login/              # Phone + OTP login
├── profile/            # Protected orders page
├── order-success/      # Order confirmation
components/
├── auth/               # PhoneInput, OtpInput, AuthGuard
├── product/            # Product UI components
├── layout/             # Navbar & Footer
hooks/
lib/
services/
store/

👨‍💻 Author

Mohammed Faisal
MERN Stack Developer

GitHub: https://github.com/iamfaisalpk

LinkedIn: https://linkedin.com/in/mohammed-faisal-a779bb2b6
