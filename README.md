# Task Manager API

🚀 A simple **Task Manager API** built with **Node.js, Express, MongoDB**, and **JWT Authentication**. This API allows users to **register, login, create tasks, update, delete, and fetch tasks with filtering & pagination**.

## 📌 Features

- **User Authentication** (Register & Login with JWT)
- **Task CRUD** (Create, Read, Update, Delete)
- **Pagination & Filtering** (Status & Priority)
- **Middleware for Authentication**
- **Redis Caching for Task Retrieval** (Optional)

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```sh
$ git clone https://github.com/yourusername/task-manager-api.git
$ cd task-manager-api
```

### 2️⃣ Install Dependencies

```sh
$ npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root folder and add:

```ini
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4️⃣ Start the Server

```sh
$ npm start
```

_Server will run at **http://localhost:5000**_

---

## 🛠 API Endpoints

### **1️⃣ User Authentication**

#### ✅ Register a User

**POST** `/api/auth/register`

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

#### ✅ Login User

**POST** `/api/auth/login`

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

_Response:_

```json
{
  "token": "your_jwt_token",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### **2️⃣ Task Management**

#### ✅ Create Task (🔐 Requires Token)

**POST** `/api/tasks`

```json
{
  "title": "New Task",
  "description": "This is a test task",
  "status": "pending",
  "priority": "high"
}
```

#### ✅ Get Tasks with Pagination & Filtering

**GET** `/api/tasks?page=1&limit=5&status=pending&priority=high`

#### ✅ Update Task (🔐 Requires Token)

**PUT** `/api/tasks/:id`

```json
{
  "status": "completed"
}
```

#### ✅ Delete Task (🔐 Requires Token)

**DELETE** `/api/tasks/:id`

---

## 🎯 Technologies Used

- **Node.js & Express** - Backend framework
- **MongoDB & Mongoose** - Database & ODM
- **JWT (JSON Web Tokens)** - Authentication
- **Redis (Optional)** - Caching for faster responses

---

## 📌 Contribution

Feel free to fork, contribute, and improve the API.

## 📜 License

This project is open-source under the **MIT License**.
