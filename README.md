Submitted by Kumara swamy Palakuri 
# 📦 Inventory Management System

---
## 📖 Overview
This **Inventory Management System** is a full-stack web application built with modern development practices.  
It integrates a **robust backend architecture** with an **intuitive frontend experience**, ensuring efficient inventory tracking, role-based security, and real-time updates.
 
---

## 🚀 Features
- 🔐 **Role-Based Authentication** – Secure access control for Admins, Managers, and Staff.
- 🔔 **Real-Time Notifications** – Instant alerts for low stock, order updates, and critical events.
- 🏷️ **Barcode Generation & Scanning** – Fast product lookup and tracking.
- 📊 **Comprehensive Reporting** – Generate and export detailed sales & inventory reports.
- ⚡ **High Performance** – Optimized queries and caching for scalability.
- 🛠️ **Error Handling & Logging** – Robust error management with detailed logs.
- 📂 **Separation of Concerns** – Clear modular architecture for maintainability.

---

## 🏗️ Tech Stack
### Backend
- ASP.NET Core / C#  
- Entity Framework Core  
- SQL Server  

### Frontend
- React.js + TailwindCSS  
- Axios for API integration  

### Other Tools
- SignalR for real-time notifications  
- Barcode/QR Code libraries  
- Identity for authentication & role management  

---

## 📂 Project Structure
```
InventoryManagementSystem/
- │── Backend/ # ASP.NET Core Web API
- │ ├── Controllers/
- │ ├── Models/
- │ ├── Data/
- │ └── Services/
- │
- │── Frontend/ # React + Tailwind
- │ ├── src/components/
- │ ├── src/pages/
- │ ├── src/services/
- │ ├── src/store/
- │ └── src/utils/
- │
- │── README.md 
```
---
## Detailed Structure
### Backend
```
InventoryManagement.API/
├── Controllers/              # API Controllers
│   ├── ProductsController.cs
│   ├── AuthController.cs
│   ├── ManagerController.cs
│   └── StaffController.cs
├── Data/                     # Database Context & Migrations
│   ├── ApplicationDbContext.cs
│   └── Migrations/
├── Models/                   # Domain Models
│   ├── Product.cs
│   ├── User.cs
│   └── InventoryMovement.cs
├── Dtos/                     # Data Transfer Objects
│   ├── ProductCreateDto.cs
│   ├── ProductUpdateDto.cs
│   └── ProductResponseDto.cs
├── Services/                 # Business Logic
│   ├── IAuthService.cs
│   └── AuthService.cs
└── Program.cs               # Application Entry Point

```
### Frontend
```
inventory-frontend/
├── src/
│   ├── components/           # Reusable UI Components
│   │   ├── ui/              # Basic UI Components
│   │   ├── ProductCard.jsx
│   │   ├── ProductCodeModal.jsx
│   │   └── NotificationBell.jsx
│   ├── pages/               # Page Components
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   └── Analytics.jsx
│   ├── store/               # Redux Store
│   │   ├── store.js
│   │   ├── authSlice.js
│   │   └── api.js
│   ├── utils/               # Utility Functions
│   │   └── productImages.js
│   └── App.jsx             # Root Component
├── public/
├── package.json
└── tailwind.config.js

```


## ⚙️ Installation & Setup
### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js & npm](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/)

### Steps
1. Clone the repository:
   ```
   git clone https://github.com/your-username/inventory-management-system.git
   cd inventory-management-system 

### Setup Backend:
```
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

### Setup Frontend:
```
cd Frontend
npm install
npm run dev 
```


### Access the application at:
```
http://localhost:5173
```
### Testing
```
Unit tests using xUnit (Backend)

React Testing Library + Jest (Frontend)

Run backend tests:

dotnet test 
```


### Run frontend tests:
```
npm test
```

📊 Future Improvements

📱 Mobile app version (React Native)

🌐 Multi-language support

🤖 AI-powered demand forecasting

☁️ Cloud deployment with Docker & Kubernetes

---
 📜 Conclusion
-
This Inventory Management System demonstrates a comprehensive understanding of modern web development practices, combining robust backend architecture with an intuitive frontend experience.
The implementation showcases advanced features while maintaining high code quality, scalability, and performance standards.
