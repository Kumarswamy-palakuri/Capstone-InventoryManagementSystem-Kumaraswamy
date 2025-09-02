// import React from 'react';
// import { useSelector } from 'react-redux';
// import { selectCurrentUser } from '../store/authSlice';
// import { useGetProductsQuery } from '../services/api';
// import Card from '../components/ui/Card';
// import StaffActivity from '../components/StaffActivity';
// import { CubeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// const StaffDashboard = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: products = [], isLoading } = useGetProductsQuery();

//   const totalProducts = products.length;
//   const lowStockProducts = products.filter(p => p.isLowStock);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">
//           Welcome back, {user?.firstName}!
//         </h2>
//         <p className="text-gray-600">Manage your inventory movements efficiently.</p>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card>
//           <div className="flex items-center">
//             <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
//               <CubeIcon className="h-6 w-6 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <div className="text-sm font-medium text-gray-500">Total Products</div>
//               <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
//             </div>
//           </div>
//         </Card>

//         <Card>
//           <div className="flex items-center">
//             <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
//               <ClipboardDocumentListIcon className="h-6 w-6 text-red-600" />
//             </div>
//             <div className="ml-4">
//               <div className="text-sm font-medium text-gray-500">Low Stock Items</div>
//               <div className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Activity Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Recent Activities">
//           <StaffActivity />
//         </Card>
        
//         <Card title="Quick Actions">
//           <div className="space-y-3">
//             <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">
//               Record New Movement
//             </button>
//             <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700">
//               View All Products
//             </button>
//             <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
//               Check Low Stock
//             </button>
//           </div>
//         </Card>
//       </div>

//       {/* Low Stock Alert */}
//       {lowStockProducts.length > 0 && (
//         <Card title="Low Stock Alert" className="border-l-4 border-red-500">
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <h3 className="text-sm font-medium text-red-800 mb-2">
//               {lowStockProducts.length} products are running low
//             </h3>
//             <div className="text-sm text-red-700">
//               <ul className="list-disc pl-5 space-y-1">
//                 {lowStockProducts.slice(0, 5).map((product) => (
//                   <li key={product.id}>
//                     {product.name} - Only {product.quantity} left
//                   </li>
//                 ))}
//                 {lowStockProducts.length > 5 && (
//                   <li>... and {lowStockProducts.length - 5} more items</li>
//                 )}
//               </ul>
//             </div>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default StaffDashboard;
