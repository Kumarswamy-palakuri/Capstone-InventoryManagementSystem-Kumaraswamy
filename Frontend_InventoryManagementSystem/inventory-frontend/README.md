# Full-Stack Inventory Management System

A comprehensive inventory management system built with ASP.NET Core 8 backend and React frontend, featuring role-based access control, real-time inventory tracking, and advanced reporting capabilities.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, Staff)
- Registration requires admin approval
- Secure password policies

### Inventory Management
- **Admin**: Full CRUD operations on products
- **Manager**: Update product details and view analytics
- **Staff**: Record inventory movements and view stock
- Real-time stock tracking with movement logs

### Reporting & Analytics
- Export inventory logs as CSV
- Export product details as CSV
- Low stock alerts and notifications
- Dashboard with key metrics

### User Management
- Admin can approve/reject user registrations
- Role assignment and management
- User activity tracking

## 🛠️ Tech Stack

**Backend:**
- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger/OpenAPI

**Frontend:**
- React 18
- Redux Toolkit & RTK Query
- React Router v6
- Tailwind CSS
- React Hook Form

**DevOps:**
- Docker & Docker Compose
- Nginx (for frontend)

## 🏗️ Project Structure

Inventory-Management-System/
├── backend/ # ASP.NET Core API
│ ├── Controllers/ # API controllers
│ ├── Models/ # Entity models
│ ├── Data/ # DbContext
│ ├── Dtos/ # Data transfer objects
│ ├── Services/ # Business logic
│ └── Program.cs # Application entry point
├── frontend/ # React application
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Route components
│ │ ├── services/ # API integration
│ │ ├── store/ # Redux store
│ │ └── App.jsx # Main component
├── docker-compose.yml # Container orchestration
└── README.md # This file