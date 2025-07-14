# Task Manager App

A modern, responsive task management web application built with React, TypeScript, and Vite. This frontend application provides an intuitive interface for creating, managing, and tracking tasks with user authentication access control.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT token management
- **Task Management**: Create, view, update, and delete tasks
- **Task Assignment**: Assign tasks to users with role-based permissions
- **Task Status Tracking**: Mark tasks as complete or incomplete
- **Responsive Design**: UI built with Bootstrap 5
- **Real-time Updates**: Automatic refresh of task lists after operations
- **Tabbed Interface**: Separate views for "My Tasks" and "All Tasks"
- **Modal Dialogs**: Clean task creation and detail viewing
- **Protected Routes**: Authentication-required access to main features

## 🛠️ Tech Stack

- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.4
- **UI Framework**: Bootstrap 5.3.7
- **Routing**: React Router DOM 7.6.3
- **HTTP Client**: Axios 1.10.0

## 📋 Prerequisites

- Node.js 18+
- npm
- Backend API running (see backend README for setup)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your API endpoint:

```bash
cp .example.env .env
```

Edit `.env` with your backend API URL:

```env
VITE_BASE_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/                # Reusable UI components
│   ├── CreateTaskModal.tsx    # Task creation modal
│   ├── RequireAuth.tsx        # Authentication guard
│   └── TaskDetailsModal.tsx   # Task details modal
├── hooks/                     # Custom React hooks
│   ├── useCompleteTask.ts     # Task completion logic
│   ├── useCreateTask.ts       # Task creation logic
│   ├── useDeleteTask.ts       # Task deletion logic
│   ├── useGetAllTasks.ts      # Fetch all tasks
│   ├── useTasks.ts            # Fetch user tasks
│   └── useUpdateTask.ts       # Task update logic
├── pages/                     # Page components
│   ├── Home.tsx               # Main dashboard
│   ├── Login.tsx              # Login page
│   └── Register.tsx           # Registration page
├── utils/                     # Utility functions
│   └── api.ts                 # Axios API configuration
├── types.ts                   # TypeScript type definitions
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

## 🔐 Authentication Flow

1. **Registration**: Users can create new accounts at `/register`
2. **Login**: Users authenticate at `/login` to receive JWT token
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Protected Routes**: Main application requires authentication
5. **Auto Logout**: Automatic logout on token expiration or 401 errors

## 🎯 Key Features

### Task Management

- **Create Tasks**: Add new tasks with title, description, and assignee
- **View Tasks**: Browse tasks in a clean, card-based layout
- **Update Tasks**: Modify task details and completion status
- **Delete Tasks**: Remove tasks with confirmation
- **Task Details**: View comprehensive task information in modal dialogs

### User Interface

- **Dark Theme**: Modern dark UI with Bootstrap styling
- **Responsive Design**: Works on desktop and mobile devices
- **Tab Navigation**: Switch between personal and all tasks
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages

### Data Management

- **Real-time Sync**: Automatic refresh after task operations
- **Error Recovery**: Graceful handling of network errors
- **Token Management**: Automatic token inclusion in API requests

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint with TypeScript configuration. Run linting:

```bash
npm run lint
```

### Environment Variables

- `VITE_BASE_URL`: Backend API base URL (default: http://localhost:8000)

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t task-manager-app .

# Run the container
docker run -p 80:80 task-manager-app
```

## 🔗 API Integration

This frontend integrates with a FastAPI backend that provides:

- **Authentication**: JWT-based user authentication
- **Task CRUD**: Complete task management operations
- **User Management**: User registration and profile management
- **Role-based Access**: Admin and regular user permissions

See the backend README for API documentation and setup instructions.

## 🚨 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Authentication-required access control
- **Input Validation**: TypeScript type checking and form validation
- **Secure Storage**: Token storage in localStorage with automatic cleanup
