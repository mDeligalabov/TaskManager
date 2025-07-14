# Task Management API - FastAPI Backend

A robust REST API built with FastAPI for managing tasks and users in a task management system. This backend provides authentication, user management, and task CRUD operations with JWT token-based security.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: User registration, login, and profile management
- **Task Management**: Full CRUD operations for tasks with status tracking
- **Database Integration**: MySQL database with SQLModel(SQLAlchemy + Pydantic) ORM
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and logging
- **Docker Support**: Containerized deployment ready

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.116.0
- **Database**: MySQL with PyMySQL
- **ORM**: SQLModel
- **Authentication**: JWT tokens with python-jose
- **Password Hashing**: bcrypt
- **Environment**: python-dotenv
- **Server**: Uvicorn
- **Testing**: pytest

## 📋 Prerequisites

- Python 3.11+
- MySQL database server
- Docker (optional)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd be
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the example environment file and configure your database:

```bash
cp example.env .env
```

Edit `.env` with your database credentials:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=task_manager_db
MYSQL_USER=tm_user
MYSQL_PASSWORD=tm_user_password

# JWT Configuration
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
TOKEN_EXPIRE_MINUTES=60
```

### 3. Database Setup

Create the MySQL database and user:

```sql
CREATE DATABASE task_manager_db;
CREATE USER 'tm_user'@'localhost' IDENTIFIED BY 'tm_user_password';
GRANT ALL PRIVILEGES ON task_manager_db.* TO 'tm_user'@'localhost';
FLUSH PRIVILEGES;
```

For a easier DB setup use the docker-compose for spinning up a MySQL database.

### 4. To run the Application locally

```bash
uvicorn main:app --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. **Register** a new user at `POST /users/register`
2. **Login** at `POST /users/login` to get an access token
3. Include the token in the `Authorization` header: `Bearer <your_token>`

## 📁 Project Structure

```
be/
├── main.py              # FastAPI application entry point
├── database.py          # Database configuration and session management
├── logger.py            # Logging configuration
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker configuration
├── example.env          # Environment variables template
├── models/              # SQLModel models
│   ├── user.py          # User model + DTOs
│   ├── task.py          # Task model + DTOs
│   └── token.py         # Token DTO
├── router/              # API route handlers
│   ├── user_router.py   # User-related endpoints
│   └── task_router.py   # Task-related endpoints
├── service/             # Business logic layer
│   ├── auth_service.py  # Authentication logic
│   ├── user_service.py  # User management logic
│   └── task_service.py  # Task management logic
├── utils/               # Utility functions
│   ├── dependencies.py  # FastAPI dependencies
│   ├── security.py      # Security utilities
│   └── exception.py     # Custom exceptions
└── tests/              # Test files
    ├── conftest.py     # Test configuration
    ├── test_user_service.py
    └── test_task_service.py
```

## 🔌 API Endpoints

### Authentication Endpoints

- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get access token
- `GET /users/me` - Get current user profile (protected)

### Task Endpoints

- `GET /tasks/` - Get all tasks (protected)
- `POST /tasks/` - Create a new task (protected)
- `GET /tasks/{task_id}` - Get specific task (protected)
- `PUT /tasks/{task_id}` - Update a task (protected)
- `DELETE /tasks/{task_id}` - Delete a task (protected)

### Health Check

- `GET /health` - API health check

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t task-management-api .

# Run the container
docker run -p 8000:8000 task-management-api
```

## 🧪 Testing

Run the test suite:

```bash
pytest
```

Run tests with coverage:

```bash
pytest --cov=.
```

## 🔧 Development

### Code Style

The project follows PEP 8 guidelines. Consider using:

```bash
pip install black isort flake8
black .
isort .
flake8 .
```

### Database Syncing

The application uses SQLModel which automatically creates tables based on model definitions. Tables are created on application startup.

### Logging

Logging is configured in `logger.py` and provides structured logging for debugging and monitoring.

## 🚨 Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens have configurable expiration
- CORS is configured for cross-origin requests
- Environment variables are used for sensitive configuration
- Input validation is handled by Pydantic models
