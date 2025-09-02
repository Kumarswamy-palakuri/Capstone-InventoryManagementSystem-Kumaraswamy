// import { useSelector } from 'react-redux';
// import { BellIcon } from '@heroicons/react/24/outline';
// import { selectCurrentUser } from '../../store/authSlice';
// import { useGetLowStockProductsQuery } from '../../services/api';

// const Header = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: lowStockProducts = [] } = useGetLowStockProductsQuery(undefined, {
//     skip: user?.role === 'Staff'
//   });

//   const showNotifications = user?.role !== 'Staff' && lowStockProducts.length > 0;

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Inventory Management System
//           </h1>
//           <div className="flex items-center space-x-4">
//             {showNotifications && (
//               <div className="relative">
//                 <BellIcon className="h-6 w-6 text-gray-600" />
//                 {lowStockProducts.length > 0 && (
//                   <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
//                     {lowStockProducts.length}
//                   </span>
//                 )}
//               </div>
//             )}
//             <div className="text-sm text-gray-600">
//               Welcome, {user?.firstName}!
//             </div>
//           </div>
//         </div>
//         {showNotifications && (
//           <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
//             <p className="text-sm text-yellow-800">
//               <strong>{lowStockProducts.length}</strong> products are running low on stock.
//             </p>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import { useGetLowStockProductsQuery } from '../../services/api';
import LowStockNotification from '../LowStockNotification';

const Header = () => {
  const user = useSelector(selectCurrentUser);
  const [showNotifications, setShowNotifications] = useState(true);

  // Fetch low stock products
  const { data: lowStockProducts = [] } = useGetLowStockProductsQuery(undefined, {
    skip: user?.role === 'Staff'
  });

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 ">
      {/* Main Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Inventory Management
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <LowStockNotification />
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Simple Notification Alert - Your requested feature */}
      {user?.role !== 'Staff' && showNotifications && lowStockProducts.length > 0 && (
        <div className="px-6 pb-2">
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>{lowStockProducts.length}</strong> products are running low on stock.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

