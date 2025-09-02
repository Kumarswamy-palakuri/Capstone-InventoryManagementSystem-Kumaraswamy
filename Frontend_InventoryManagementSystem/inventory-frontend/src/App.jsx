import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectCurrentUser } from "./store/authSlice";

// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Existing Pages - No new files needed
import MovementsPage from "./pages/MovementsPage";
import Analytics from "./pages/Admin/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import UserManagement from "./pages/Admin/UserManagement";
import Approvals from "./pages/Admin/Approvals";
import AdminLogs from "./pages/Admin/AdminLogs";
import NewMovement from "./pages/Staff/NewMovement";
import Logs from "./pages/Manager/Logs";
import UserForm from './components/UserForm';
import ManagerReports from './pages/Manager/ManagerReports';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (!isAuthenticated) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="h-screen flex bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <Routes>
              {/* Common Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />

              {/* Admin Routes - Updated paths to /admin/* */}
              <Route
                path="/admin/movement"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <NewMovement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/movements"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <MovementsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Approvals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/logs"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Logs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/create"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />

              {/* Manager Routes - Updated paths to /manager/* */}
              <Route
                path="/manager/movement"
                element={
                  <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                    <NewMovement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/movements"
                element={
                  <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                    <MovementsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/logs"
                element={
                  <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                    <Logs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/reports"
                element={
                  <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                    <ManagerReports />
                  </ProtectedRoute>
                }
              />

              {/* Staff Routes - Keep existing /staff/* paths */}
              <Route
                path="/staff/movement"
                element={
                  <ProtectedRoute allowedRoles={["Staff", "Manager", "Admin"]}>
                    <NewMovement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/movements"
                element={
                  <ProtectedRoute allowedRoles={["Staff", "Manager", "Admin"]}>
                    <MovementsPage />
                  </ProtectedRoute>
                }
              />

              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
