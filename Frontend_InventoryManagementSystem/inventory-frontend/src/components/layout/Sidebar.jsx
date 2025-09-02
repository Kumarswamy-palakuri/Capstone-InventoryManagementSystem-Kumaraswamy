// import { Fragment } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   HomeIcon,
//   CubeIcon,
//   ClipboardDocumentListIcon,
//   UserGroupIcon,
//   ArrowRightOnRectangleIcon,
//   ChartBarIcon,
//   ExclamationTriangleIcon
// } from '@heroicons/react/24/outline';
// import { selectCurrentUser } from '../../store/authSlice';
// import { logout } from '../../store/authSlice';

// const Sidebar = () => {
//   const user = useSelector(selectCurrentUser);
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   const getNavigationItems = () => {
//     const baseItems = [
//       { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
//       { name: 'Products', href: '/products', icon: CubeIcon },
//     ];
//  console.log('Current user role:', user?.role); // Add this for debugging
//     if (user?.role === 'Admin' || user?.role === 3 ) {
//       return [
//         ...baseItems,
//         { name: 'New Movement', href: '/staff/movement', icon: ClipboardDocumentListIcon },
//       // { name: 'My Movements', href: '/staff/movements', icon: ClipboardDocumentListIcon },
//             { name: 'My Movements', href: '/staff/movements', icon: ClipboardDocumentListIcon },

//       { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
//         { name: 'Pending Approvals', href: '/admin/approvals', icon: ExclamationTriangleIcon },
//         // { name: 'All Logs', href: '/admin/logs', icon: ClipboardDocumentListIcon },
//                { name: 'Inventory Logs', href: '/manager/logs', icon: ClipboardDocumentListIcon },

//         { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
//       ];
//     }

//     if (user?.role === 'Manager' || user?.role === 2) {
//       return [
//         ...baseItems,
//       { name: 'My Movements', href: '/staff/movements', icon: ClipboardDocumentListIcon },

//         { name: 'Inventory Logs', href: '/manager/logs', icon: ClipboardDocumentListIcon },
//         { name: 'Reports', href: '/manager/reports', icon: ChartBarIcon },
//       ];
//     }

//     // Staff
//     return [
//       ...baseItems,
//       { name: 'New Movement', href: '/staff/movement', icon: ClipboardDocumentListIcon },
//       { name: 'My Movements', href: '/staff/movements', icon: ClipboardDocumentListIcon },
//     ];
//   };

//   const navigation = getNavigationItems();

//   return (
//     <div className="flex h-full w-64 flex-col bg-gray-900">
//       <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
//         <div className="flex flex-shrink-0 items-center px-4">
//           <h1 className="text-xl font-bold text-white">Inventory System</h1>
//         </div>
//         <nav className="mt-8 flex-1 space-y-1 px-2">
//           {navigation.map((item) => {
//             const isActive = location.pathname === item.href;
//             return (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`
//                   group flex items-center px-2 py-2 text-sm font-medium rounded-md
//                   ${isActive
//                     ? 'bg-gray-800 text-white'
//                     : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }
//                 `}
//               >
//                 <item.icon
//                   className={`mr-3 h-6 w-6 flex-shrink-0 ${
//                     isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
//                   }`}
//                 />
//                 {item.name}
//               </Link>
//             );
//           })}
//         </nav>
//         <div className="flex flex-shrink-0 p-4">
//           <div className="w-full">
//             <div className="flex items-center">
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-white">
//                   {user?.firstName} {user?.lastName}
//                 </p>
//                 <p className="text-xs text-gray-400">{user?.role}</p>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="mt-3 group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
//             >
//               <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-white" />
//               Sign out
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// import { Fragment } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   HomeIcon,
//   CubeIcon,
//   ClipboardDocumentListIcon,
//   UserGroupIcon,
//   ArrowRightOnRectangleIcon,
//   ChartBarIcon,
//   ExclamationTriangleIcon
// } from '@heroicons/react/24/outline';
// import { selectCurrentUser } from '../../store/authSlice';
// import { logout } from '../../store/authSlice';

// const Sidebar = () => {
//   const user = useSelector(selectCurrentUser);
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   const getNavigationItems = () => {
//     const baseItems = [
//       { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
//       { name: 'Products', href: '/products', icon: CubeIcon },
//     ];

//     console.log('Current user role:', user?.role);

//     // Admin Routes - Updated paths to /admin/*
//     if (user?.role === 'Admin' || user?.role === 3) {
//       return [
//         ...baseItems,
//         { name: 'New Movement', href: '/admin/movement', icon: ClipboardDocumentListIcon },
//         { name: 'My Movements', href: '/admin/movements', icon: ClipboardDocumentListIcon },
//         { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
//         { name: 'Pending Approvals', href: '/admin/approvals', icon: ExclamationTriangleIcon },
//         { name: 'Inventory Logs', href: '/admin/logs', icon: ClipboardDocumentListIcon },
//         { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
//       ];
//     }

//     // Manager Routes - Updated paths to /manager/*
//     if (user?.role === 'Manager' || user?.role === 2) {
//       return [
//         ...baseItems,
//         { name: 'New Movement', href: '/manager/movement', icon: ClipboardDocumentListIcon },
//         { name: 'My Movements', href: '/manager/movements', icon: ClipboardDocumentListIcon },
//         { name: 'Inventory Logs', href: '/manager/logs', icon: ClipboardDocumentListIcon },
//         { name: 'Reports', href: '/manager/reports', icon: ChartBarIcon },
//       ];
//     }

//     // Staff Routes - Keep /staff/* paths
//     return [
//       ...baseItems,
//       { name: 'New Movement', href: '/staff/movement', icon: ClipboardDocumentListIcon },
//       { name: 'My Movements', href: '/staff/movements', icon: ClipboardDocumentListIcon },
//     ];
//   };

//   const navigation = getNavigationItems();

//   return (
//     <div className="flex h-full w-64 flex-col bg-gray-900">
//       <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
//         <div className="flex flex-shrink-0 items-center px-4">
//           <h1 className="text-xl font-bold text-white">Inventory System</h1>
//         </div>
//         <nav className="mt-8 flex-1 space-y-1 px-2">
//           {navigation.map((item) => {
//             const isActive = location.pathname === item.href;
//             return (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`
//                   group flex items-center px-2 py-2 text-sm font-medium rounded-md
//                   ${isActive
//                     ? 'bg-gray-800 text-white'
//                     : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }
//                 `}
//               >
//                 <item.icon
//                   className={`mr-3 h-6 w-6 flex-shrink-0 ${
//                     isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
//                   }`}
//                 />
//                 {item.name}
//               </Link>
//             );
//           })}
//         </nav>
//         <div className="flex flex-shrink-0 p-4">
//           <div className="w-full">
//             <div className="flex items-center">
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-white">
//                   {user?.firstName} {user?.lastName}
//                 </p>
//                 <p className="text-xs text-gray-400">{user?.role}</p>
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="mt-3 group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
//             >
//               <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-white" />
//               Sign out
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { selectCurrentUser } from "../../store/authSlice";
import { logout } from "../../store/authSlice";

const Sidebar = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getNavigationItems = () => {
    const baseItems = [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Products", href: "/products", icon: CubeIcon },
    ];

    console.log("Current user role:", user?.role);

    // Admin Routes - Updated paths to /admin/*
    if (user?.role === "Admin" || user?.role === 3) {
      return [
        ...baseItems,
        {
          name: "New Movement",
          href: "/admin/movement",
          icon: ClipboardDocumentListIcon,
        },
        {
          name: "My Movements",
          href: "/admin/movements",
          icon: ClipboardDocumentListIcon,
        },
        { name: "User Management", href: "/admin/users", icon: UserGroupIcon },
        {
          name: "Pending Approvals",
          href: "/admin/approvals",
          icon: ExclamationTriangleIcon,
        },
        {
          name: "Inventory Logs",
          href: "/admin/logs",
          icon: ClipboardDocumentListIcon,
        },
        { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
      ];
    }

    // Manager Routes - Updated paths to /manager/*
    if (user?.role === "Manager" || user?.role === 2) {
      return [
        ...baseItems,
        {
          name: "New Movement",
          href: "/manager/movement",
          icon: ClipboardDocumentListIcon,
        },
        {
          name: "My Movements",
          href: "/manager/movements",
          icon: ClipboardDocumentListIcon,
        },
        {
          name: "Inventory Logs",
          href: "/manager/logs",
          icon: ClipboardDocumentListIcon,
        },
        { name: "Reports", href: "/manager/reports", icon: ChartBarIcon },
      ];
    }

    // Staff Routes - Keep /staff/* paths
    return [
      ...baseItems,
      {
        name: "New Movement",
        href: "/staff/movement",
        icon: ClipboardDocumentListIcon,
      },
      {
        name: "My Movements",
        href: "/staff/movements",
        icon: ClipboardDocumentListIcon,
      },
    ];
  };

  const navigation = getNavigationItems();

  const SidebarContent = () => (
    <>
      <div className="flex flex-shrink-0 items-center px-4">
        <h1 className="text-xl font-bold text-white">Inventory System</h1>
      </div>
      <nav className="mt-8 flex-1 space-y-1 px-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeMobileMenu}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-shrink-0 p-4">
        <div className="w-full">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="mt-3 group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-white" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button - Fixed header */}
      <div className="lg:hidden">
<div className="lg:hidden">
  <div className="flex flex-col items-start bg-purple-950 px-1 py-3 border-b border-gray-700 shadow-lg h-screen">
    <button
      type="button"
      className="inline-flex items-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white  transition-colors duration-200"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
    </button>

    {/* Example: Menu title */}
    {/* <h1 className="text-lg font-bold text-white mt-4">Menu</h1> */}
  </div>
</div>

      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:h-full lg:w-64 lg:flex-col lg:bg-purple-950 lg:shadow-xl">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar with slide-in animation */}
      <div
        className={`fixed inset-0 flex z-50 lg:hidden ${
          isMobileMenuOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gray-500 transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-75" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
        />

        {/* Sidebar with slide animation */}
        <div
          className={`relative flex w-full max-w-xs flex-1 flex-col bg-purple-950 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close button - only visible when menu is open */}
          {isMobileMenuOpen && (
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200 hover:bg-gray-700"
                onClick={closeMobileMenu}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
