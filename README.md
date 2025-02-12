# 📧 Email Application (For Programming 2 [223 CSE] Course)

A web-based email application built using **Spring Boot** for the backend and **React.js** for the frontend. Users can **send, receive, filter, sort, and manage emails**, along with managing contacts and folders.

## 📌 Features
- User authentication (Sign Up & Login)
- Send and receive emails
- Email filtering and sorting
- Compose emails with attachments and priority settings
- Inbox, Sent, Drafts, and Trash folders
- Custom folder creation and management
- Contact management (Add, Rename, Delete)
- Logout functionality

## 🛠️ Design Patterns Used
### 1️⃣ Singleton Design Pattern
Used for large classes that require only **one instance**, improving memory usage and reusability.

### 2️⃣ Adapter Design Pattern
Implemented to **sort emails** based on user-selected criteria and retrieve them in the specified order.

### 3️⃣ Filter Design Pattern
Allows filtering emails based on user-defined **criteria** to find emails that match specific attributes.

### 4️⃣ Builder Design Pattern
Used for **user profile creation**, managing attributes like username, password, and default folders in a structured way.

### 5️⃣ Proxy Design Pattern
Prevents unauthorized access to the system by ensuring only **logged-in users** can access their emails.

### 6️⃣ Prototype Design Pattern
Facilitates **cloning** email objects, allowing multiple recipients to receive personalized copies of an email.

## 🚀 How to Run the Project

### Backend (Spring Boot)
1. Open the `EMail_Backend` folder in **IntelliJ IDEA** or any Java IDE.
2. Run `EmailApplication.java`.

### Frontend (React.js)
1. Open the `paint-frontend` folder in **Visual Studio Code** or any code editor.
2. Open the terminal and run:
   ```sh
   npm install
   npm run dev
3. The frontend will be accessible at http://localhost:5173/.

## 📷 UI Snapshots

1️⃣ Sign Up Page

![image](https://github.com/user-attachments/assets/d2d39d78-277b-4705-870e-266a5d438eeb)

2️⃣ Login Page

![image](https://github.com/user-attachments/assets/94a794c9-8c64-430b-9248-757ce2975717)

3️⃣ Inbox 

![image](https://github.com/user-attachments/assets/2aa03b0f-3784-4975-961b-52544daa9e4b)

More in [Report](Lab 04 Report.pdf)

## 📘 Contributors
- Badr Elsayed
- Adham Anas
- Nour Khaled Mohamed
- Ali El-Deen Maher
