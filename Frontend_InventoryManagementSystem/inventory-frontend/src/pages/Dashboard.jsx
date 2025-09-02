// // import { useSelector } from 'react-redux';
// // import { useState, useEffect } from 'react';
// // import { selectCurrentUser } from '../store/authSlice';
// // import { useGetProductsQuery, useGetLowStockProductsQuery } from '../services/api';
// // import Card from '../components/ui/Card';
// // import Button from '../components/ui/Button';
// // import ExportReportsModal from '../components/ExportReportsModal'; // Add this import
// // import { CubeIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// // const Dashboard = () => {
// //   const user = useSelector(selectCurrentUser);
// //   const { data: products = [], isLoading } = useGetProductsQuery();
// //   const { data: lowStockProducts = [] } = useGetLowStockProductsQuery(undefined, {
// //     skip: user?.role === 'Staff'
// //   });
// //   const [isExportModalOpen, setIsExportModalOpen] = useState(false);



// //   const totalProducts = products.length;
// //   const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
// //   const lowStockCount = lowStockProducts.length;

// //   const recentLogs = logs.slice(0, 5);

// //   const getMovementTypeText = (type) => {
// //     const typeMapping = {
// //       1: 'Stock In',
// //       2: 'Stock Out', 
// //       3: 'Adjustment',
// //       4: 'Sale',
// //       5: 'Return',
// //       6: 'Damage'
// //     };
// //     return typeMapping[type] || 'Unknown';
// //   };

// //   const getDashboardCards = () => {
// //     const baseCards = [
// //       {
// //         title: 'Total Products',
// //         value: totalProducts,
// //         icon: CubeIcon,
// //         color: 'text-blue-600',
// //         bgColor: 'bg-blue-100',
// //       },
// //       {
// //         title: 'Total Inventory Value',
// //         value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
// //         icon: ChartBarIcon,
// //         color: 'text-green-600',
// //         bgColor: 'bg-green-100',
// //       },
// //     ];

// //     if (user?.role !== 'Staff') {
// //       baseCards.push({
// //         title: 'Low Stock Items',
// //         value: lowStockCount,
// //         icon: ExclamationTriangleIcon,
// //         color: lowStockCount > 0 ? 'text-red-600' : 'text-gray-600',
// //         bgColor: lowStockCount > 0 ? 'bg-red-100' : 'bg-gray-100',
// //       });
// //     }

// //     return baseCards;
// //   };

// //   const cards = getDashboardCards();

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h2 className="text-2xl font-bold text-gray-900">
// //           Welcome back, {user?.firstName}!
// //         </h2>
// //         <p className="text-gray-600">Here's what's happening with your inventory today.</p>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {cards.map((card, index) => (
// //           <Card key={index}>
// //             <div className="flex items-center">
// //               <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
// //                 <card.icon className={`h-6 w-6 ${card.color}`} />
// //               </div>
// //               <div className="ml-4">
// //                 <div className="text-sm font-medium text-gray-500">{card.title}</div>
// //                 <div className="text-2xl font-bold text-gray-900">{card.value}</div>
// //               </div>
// //             </div>
// //           </Card>
// //         ))}
// //       </div>

// //       {user?.role !== 'Staff' && lowStockCount > 0 && (
// //         <Card title="Low Stock Alert" className="border-l-4 border-red-500">
// //           <div className="bg-red-50 border border-red-200 rounded-md p-4">
// //             <div className="flex">
// //               <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
// //               <div className="ml-3">
// //                 <h3 className="text-sm font-medium text-red-800">
// //                   {lowStockCount} products are running low on stock
// //                 </h3>
// //                 <div className="mt-2 text-sm text-red-700">
// //                   <ul className="list-disc pl-5 space-y-1">
// //                     {lowStockProducts.slice(0, 5).map((product) => (
// //                       <li key={product.id}>
// //                         {product.name} - Only {product.quantity} left
// //                       </li>
// //                     ))}
// //                     {lowStockCount > 5 && (
// //                       <li>... and {lowStockCount - 5} more items</li>
// //                     )}
// //                   </ul>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </Card>
// //       )}

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {/* <Card title="Recent Activity">
// //           <p className="text-gray-500">Recent inventory movements will be displayed here.</p>
// //         </Card> */}
// //               <Card title="Recent Activity (Last 5)">
// //           {recentLogs.length === 0 ? (
// //             <p className="text-gray-500">No recent activity to display.</p>
// //           ) : (
// //             <div className="space-y-3">
// //               {recentLogs.map((log) => (
// //                 <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
// //                   <div className="flex-1">
// //                     <div className="flex items-center space-x-2">
// //                       <span className="text-sm font-medium text-gray-900">
// //                         {log.productName}
// //                       </span>
// //                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// //                         log.change > 0 
// //                           ? 'text-green-700 bg-green-100' 
// //                           : 'text-red-700 bg-red-100'
// //                       }`}>
// //                         {getMovementTypeText(log.type)}
// //                       </span>
// //                     </div>
// //                     <div className="text-xs text-gray-500 mt-1">
// //                       {log.userName} • {log.reason}
// //                     </div>
// //                   </div>
// //                   <div className="text-right">
// //                     <div className={`text-sm font-medium ${
// //                       log.change > 0 ? 'text-green-600' : 'text-red-600'
// //                     }`}>
// //                       {log.change > 0 ? '+' : ''}{log.change}
// //                     </div>
// //                     <div className="text-xs text-gray-500">
// //                       {new Date(log.timestamp).toLocaleDateString()}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </Card>
// //         <Card title="Quick Actions">
// //           <div className="space-y-3">
// //             {user?.role === 'Admin' && (
// //               <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">
// //                 Manage Users
// //               </button>
// //             )}
// //             {(user?.role === 'Manager' || user?.role === 'Admin') && (
// //               <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700">
// //                 Export Reports
// //               </button>
// //             )}
// //             {user?.role === 'Staff' && (
// //               <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
// //                 Record Movement
// //               </button>
// //             )}
// //           </div>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;
// import { useSelector } from 'react-redux';
// import { useState, useEffect } from 'react';
// import { selectCurrentUser } from '../store/authSlice';
// import { 
//   useGetProductsQuery, 
//   useGetLowStockProductsQuery, 
//   useGetAdminLogsQuery  // Add this import
// } from '../services/api';
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import ExportReportsModal from '../components/ExportReportsModal';
// import { CubeIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// const Dashboard = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: products = [], isLoading } = useGetProductsQuery();
//   const { data: lowStockProducts = [] } = useGetLowStockProductsQuery(undefined, {
//     skip: user?.role === 'Staff'
//   });
  
//   // Add this line to fetch logs data
//   const { data: logs = [] } = useGetAdminLogsQuery(undefined, {
//     skip: user?.role === 'Staff'
//   });
  
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);

//   const totalProducts = products.length;
//   const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
//   const lowStockCount = lowStockProducts.length;

//   // Get last 5 logs in reverse chronological order (most recent first)
//   const recentLogs = logs.slice(-5).reverse();

//   const getMovementTypeText = (type) => {
//     const typeMapping = {
//       1: 'Stock In',
//       2: 'Stock Out', 
//       3: 'Adjustment',
//       4: 'Sale',
//       5: 'Return',
//       6: 'Damage'
//     };
//     return typeMapping[type] || 'Unknown';
//   };

//   const getDashboardCards = () => {
//     const baseCards = [
//       {
//         title: 'Total Products',
//         value: totalProducts,
//         icon: CubeIcon,
//         color: 'text-blue-600',
//         bgColor: 'bg-blue-100',
//       },
//       {
//         title: 'Total Inventory Value',
//         value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
//         icon: ChartBarIcon,
//         color: 'text-green-600',
//         bgColor: 'bg-green-100',
//       },
//     ];

//     if (user?.role !== 'Staff') {
//       baseCards.push({
//         title: 'Low Stock Items',
//         value: lowStockCount,
//         icon: ExclamationTriangleIcon,
//         color: lowStockCount > 0 ? 'text-red-600' : 'text-gray-600',
//         bgColor: lowStockCount > 0 ? 'bg-red-100' : 'bg-gray-100',
//       });
//     }

//     return baseCards;
//   };

//   const cards = getDashboardCards();

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
//         <p className="text-gray-600">Here's what's happening with your inventory today.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cards.map((card, index) => (
//           <Card key={index}>
//             <div className="flex items-center">
//               <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
//                 <card.icon className={`h-6 w-6 ${card.color}`} />
//               </div>
//               <div className="ml-4">
//                 <div className="text-sm font-medium text-gray-500">{card.title}</div>
//                 <div className="text-2xl font-bold text-gray-900">{card.value}</div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {user?.role !== 'Staff' && lowStockCount > 0 && (
//         <Card title="Low Stock Alert" className="border-l-4 border-red-500">
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <div className="flex">
//               <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">
//                   {lowStockCount} products are running low on stock
//                 </h3>
//                 <div className="mt-2 text-sm text-red-700">
//                   <ul className="list-disc pl-5 space-y-1">
//                     {lowStockProducts.slice(0, 5).map((product) => (
//                       <li key={product.id}>
//                         {product.name} - Only {product.quantity} left
//                       </li>
//                     ))}
//                     {lowStockCount > 5 && (
//                       <li>... and {lowStockCount - 5} more items</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Recent Activity (Last 5)">
//           {recentLogs.length === 0 ? (
//             <p className="text-gray-500">No recent activity to display.</p>
//           ) : (
//             <div className="space-y-3">
//               {recentLogs.map((log) => (
//                 <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm font-medium text-gray-900">
//                         {log.productName}
//                       </span>
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         log.change > 0 
//                           ? 'text-green-700 bg-green-100' 
//                           : 'text-red-700 bg-red-100'
//                       }`}>
//                         {getMovementTypeText(log.type)}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {log.userName} • {log.reason}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-sm font-medium ${
//                       log.change > 0 ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {log.change > 0 ? '+' : ''}{log.change}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {new Date(log.timestamp).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>
        
//         <Card title="Quick Actions">
//           <div className="space-y-3">
//             {user?.role === 'Admin' && (
//               <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">
//                 Manage Users
//               </button>
//             )}
//             {(user?.role === 'Manager' || user?.role === 'Admin') && (
//               <button 
//                 onClick={() => setIsExportModalOpen(true)}
//                 className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700"
//               >
//                 Export Reports
//               </button>
//             )}
//             {user?.role === 'Staff' && (
//               <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
//                 Record Movement
//               </button>
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* Export Reports Modal */}
//       <ExportReportsModal
//         isOpen={isExportModalOpen}
//         onClose={() => setIsExportModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default Dashboard;
// import { useSelector } from 'react-redux';
// import { useState, useEffect } from 'react';
// import { selectCurrentUser } from '../store/authSlice';
// import { 
//   useGetProductsQuery, 
//   useGetLowStockProductsQuery, 
//   useGetAdminLogsQuery  
// } from '../services/api';
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import ExportReportsModal from '../components/ExportReportsModal';
// import DirectDownload from '../components/DirectDownload'; // Add this import
// import { CubeIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// const Dashboard = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: products = [], isLoading } = useGetProductsQuery();
//   const { data: lowStockProducts = [] } = useGetLowStockProductsQuery(undefined, {
//     skip: user?.role === 'Staff'
//   });
  
//   const { data: logs = [] } = useGetAdminLogsQuery(undefined, {
//     skip: user?.role === 'Staff'
//   });
  
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);

//   const totalProducts = products.length;
//   const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
//   const lowStockCount = lowStockProducts.length;

//   // Get last 5 logs in reverse chronological order (most recent first)
//   const recentLogs = logs.slice(-5).reverse();

//   const getMovementTypeText = (type) => {
//     const typeMapping = {
//       1: 'Stock In',
//       2: 'Stock Out', 
//       3: 'Adjustment',
//       4: 'Sale',
//       5: 'Return',
//       6: 'Damage'
//     };
//     return typeMapping[type] || 'Unknown';
//   };

//   const getDashboardCards = () => {
//     const baseCards = [
//       {
//         title: 'Total Products',
//         value: totalProducts,
//         icon: CubeIcon,
//         color: 'text-blue-600',
//         bgColor: 'bg-blue-100',
//       },
//       {
//         title: 'Total Inventory Value',
//         value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
//         icon: ChartBarIcon,
//         color: 'text-green-600',
//         bgColor: 'bg-green-100',
//       },
//     ];

//     if (user?.role !== 'Staff') {
//       baseCards.push({
//         title: 'Low Stock Items',
//         value: lowStockCount,
//         icon: ExclamationTriangleIcon,
//         color: lowStockCount > 0 ? 'text-red-600' : 'text-gray-600',
//         bgColor: lowStockCount > 0 ? 'bg-red-100' : 'bg-gray-100',
//       });
//     }

//     return baseCards;
//   };

//   const cards = getDashboardCards();

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
//         <p className="text-gray-600">Here's what's happening with your inventory today.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cards.map((card, index) => (
//           <Card key={index}>
//             <div className="flex items-center">
//               <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
//                 <card.icon className={`h-6 w-6 ${card.color}`} />
//               </div>
//               <div className="ml-4">
//                 <div className="text-sm font-medium text-gray-500">{card.title}</div>
//                 <div className="text-2xl font-bold text-gray-900">{card.value}</div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {user?.role !== 'Staff' && lowStockCount > 0 && (
//         <Card title="Low Stock Alert" className="border-l-4 border-red-500">
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <div className="flex">
//               <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">
//                   {lowStockCount} products are running low on stock
//                 </h3>
//                 <div className="mt-2 text-sm text-red-700">
//                   <ul className="list-disc pl-5 space-y-1">
//                     {lowStockProducts.slice(0, 5).map((product) => (
//                       <li key={product.id}>
//                         {product.name} - Only {product.quantity} left
//                       </li>
//                     ))}
//                     {lowStockCount > 5 && (
//                       <li>... and {lowStockCount - 5} more items</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Recent Activity (Last 5)">
//           {recentLogs.length === 0 ? (
//             <p className="text-gray-500">No recent activity to display.</p>
//           ) : (
//             <div className="space-y-3">
//               {recentLogs.map((log) => (
//                 <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm font-medium text-gray-900">
//                         {log.productName}
//                       </span>
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         log.change > 0 
//                           ? 'text-green-700 bg-green-100' 
//                           : 'text-red-700 bg-red-100'
//                       }`}>
//                         {getMovementTypeText(log.type)}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {log.userName} • {log.reason}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-sm font-medium ${
//                       log.change > 0 ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {log.change > 0 ? '+' : ''}{log.change}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {new Date(log.timestamp).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>
        
//         <Card title="Quick Actions">
//           <div className="space-y-3">
//             {user?.role === 'Admin' && (
//               <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">
//                 Manage Users
//               </button>
//             )}
//             {(user?.role === 'Manager' || user?.role === 'Admin') && (
//               <>
//                 <button 
//                   onClick={() => setIsExportModalOpen(true)}
//                   className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700"
//                 >
//                   Export Reports (Date Range)
//                 </button>
                
//                 {/* Add Direct Download Section */}
//                 <div className="pt-2">
//                   <DirectDownload />
//                 </div>
//               </>
//             )}
//             {user?.role === 'Staff' && (
//               <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
//                 Record Movement
//               </button>
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* Export Reports Modal */}
//       <ExportReportsModal
//         isOpen={isExportModalOpen}
//         onClose={() => setIsExportModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default Dashboard;
// import { useSelector } from 'react-redux';
// import { useState, useEffect } from 'react';
// import { selectCurrentUser } from '../store/authSlice';
// import { 
//   useGetProductsQuery, 
//   useGetLowStockProductsQuery, 
//   useGetAdminLogsQuery
// } from '../services/api';
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import ExportReportsModal from '../components/ExportReportsModal';
// import { CubeIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// const Dashboard = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: products = [], isLoading } = useGetProductsQuery();
//   const { data: lowStockProducts = [] } = useGetLowStockProductsQuery(undefined, {
//     skip: user?.role === 'Staff'
//   });
  
//   // ✅ FIX: Use different endpoints based on user role
//   const { 
//     data: allLogs = [], 
//     isLoading: logsLoading 
//   } = useGetAdminLogsQuery(undefined, {
//     skip: user?.role === 'Staff'  // Only fetch for Admin/Manager
//   });
  
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);

//   const totalProducts = products.length;
//   const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
//   const lowStockCount = lowStockProducts.length;

//   // ✅ FIX: Get last 5 logs properly
//   const recentLogs = allLogs.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

//   const getMovementTypeText = (type) => {
//     const typeMapping = {
//       1: 'Stock In',
//       2: 'Stock Out', 
//       3: 'Adjustment',
//       4: 'Sale',
//       5: 'Return',
//       6: 'Damage'
//     };
//     return typeMapping[type] || 'Unknown';
//   };

//   const getDashboardCards = () => {
//     const baseCards = [
//       {
//         title: 'Total Products',
//         value: totalProducts,
//         icon: CubeIcon,
//         color: 'text-blue-600',
//         bgColor: 'bg-blue-100',
//       },
//       {
//         title: 'Total Inventory Value',
//         value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
//         icon: ChartBarIcon,
//         color: 'text-green-600',
//         bgColor: 'bg-green-100',
//       },
//     ];

//     if (user?.role !== 'Staff') {
//       baseCards.push({
//         title: 'Low Stock Items',
//         value: lowStockCount,
//         icon: ExclamationTriangleIcon,
//         color: lowStockCount > 0 ? 'text-red-600' : 'text-gray-600',
//         bgColor: lowStockCount > 0 ? 'bg-red-100' : 'bg-gray-100',
//       });
//     }

//     return baseCards;
//   };

//   const cards = getDashboardCards();

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
//         <p className="text-gray-600">Here's what's happening with your inventory today.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cards.map((card, index) => (
//           <Card key={index}>
//             <div className="flex items-center">
//               <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
//                 <card.icon className={`h-6 w-6 ${card.color}`} />
//               </div>
//               <div className="ml-4">
//                 <div className="text-sm font-medium text-gray-500">{card.title}</div>
//                 <div className="text-2xl font-bold text-gray-900">{card.value}</div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {user?.role !== 'Staff' && lowStockCount > 0 && (
//         <Card title="Low Stock Alert" className="border-l-4 border-red-500">
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <div className="flex">
//               <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">
//                   {lowStockCount} products are running low on stock
//                 </h3>
//                 <div className="mt-2 text-sm text-red-700">
//                   <ul className="list-disc pl-5 space-y-1">
//                     {lowStockProducts.slice(0, 5).map((product) => (
//                       <li key={product.id}>
//                         {product.name} - Only {product.quantity} left
//                       </li>
//                     ))}
//                     {lowStockCount > 5 && (
//                       <li>... and {lowStockCount - 5} more items</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Recent Activity (Last 5)">
//           {/* ✅ FIX: Show correct logs based on user role */}
//           {logsLoading ? (
//             <div className="flex items-center justify-center py-4">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//               <span className="ml-2">Loading activity...</span>
//             </div>
//           ) : recentLogs.length === 0 ? (
//             <p className="text-gray-500">No recent activity to display.</p>
//           ) : (
//             <div className="space-y-3">
//               {recentLogs.map((log) => (
//                 <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm font-medium text-gray-900">
//                         {log.productName}
//                       </span>
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         log.change > 0 
//                           ? 'text-green-700 bg-green-100' 
//                           : 'text-red-700 bg-red-100'
//                       }`}>
//                         {getMovementTypeText(log.type)}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {/* ✅ FIX: Show who made the movement and reason */}
//                       <span className="font-medium">{log.userName}</span> • {log.reason}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-sm font-medium ${
//                       log.change > 0 ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {log.change > 0 ? '+' : ''}{log.change}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {new Date(log.timestamp).toLocaleDateString()}
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {new Date(log.timestamp).toLocaleTimeString()}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>
        
//         <Card title="Quick Actions">
//           <div className="space-y-3">
//             {user?.role === 'Admin' && (
//               <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">
//                 Manage Users
//               </button>
//             )}
//             {(user?.role === 'Manager' || user?.role === 'Admin') && (
//               <button 
//                 onClick={() => setIsExportModalOpen(true)}
//                 className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700"
//               >
//                 Export Reports
//               </button>
//             )}
//             {user?.role === 'Staff' && (
//               <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
//                 Record Movement
//               </button>
//             )}
//           </div>
//         </Card>
        
//       </div>

//       {/* Export Reports Modal */}
//       <ExportReportsModal
//         isOpen={isExportModalOpen}
//         onClose={() => setIsExportModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default Dashboard;
// import { useSelector } from 'react-redux';
// import { useState, useEffect } from 'react';
// import { selectCurrentUser } from '../store/authSlice';
// import { 
//   useGetProductsQuery, 
//   useGetLowStockProductsQuery, 
//   useGetAdminLogsQuery
// } from '../services/api';
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import ExportReportsModal from '../components/ExportReportsModal';
// import DirectDownload from '../components/DirectDownload'; // Import DirectDownload component
// import { CubeIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
// import toast from 'react-hot-toast';

// const Dashboard = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: products = [], isLoading } = useGetProductsQuery();
//   const { data: lowStockProducts = [] } = useGetLowStockProductsQuery(undefined, {
//     skip: user?.role === 'Staff'
//   });
  
//   // ✅ FIX: Use different endpoints based on user role
//   const { 
//     data: allLogs = [], 
//     isLoading: logsLoading 
//   } = useGetAdminLogsQuery(undefined, {
//     skip: user?.role === 'Staff'  // Only fetch for Admin/Manager
//   });
  
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);

//   const totalProducts = products.length;
//   const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
//   const lowStockCount = lowStockProducts.length;

//   // ✅ FIX: Get last 5 logs properly
//   const recentLogs = allLogs.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

//   // Direct download functions
//   const downloadLogsCSV = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('https://localhost:7273/api/Manager/reports/logs.csv', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to download logs');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       toast.success('Logs CSV downloaded successfully');
//     } catch (error) {
//       toast.error('Failed to download logs CSV');
//     }
//   };

//   const downloadInventoryCSV = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('https://localhost:7273/api/Manager/reports/inventory.csv', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to download inventory');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       toast.success('Inventory CSV downloaded successfully');
//     } catch (error) {
//       toast.error('Failed to download inventory CSV');
//     }
//   };

//   const getMovementTypeText = (type) => {
//     const typeMapping = {
//       1: 'Stock In',
//       2: 'Stock Out', 
//       3: 'Adjustment',
//       4: 'Sale',
//       5: 'Return',
//       6: 'Damage'
//     };
//     return typeMapping[type] || 'Unknown';
//   };

//   const getDashboardCards = () => {
//     const baseCards = [
//       {
//         title: 'Total Products',
//         value: totalProducts,
//         icon: CubeIcon,
//         color: 'text-blue-600',
//         bgColor: 'bg-blue-100',
//       },
//       {
//         title: 'Total Inventory Value',
//         value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
//         icon: ChartBarIcon,
//         color: 'text-green-600',
//         bgColor: 'bg-green-100',
//       },
//     ];

//     if (user?.role !== 'Staff') {
//       baseCards.push({
//         title: 'Low Stock Items',
//         value: lowStockCount,
//         icon: ExclamationTriangleIcon,
//         color: lowStockCount > 0 ? 'text-red-600' : 'text-gray-600',
//         bgColor: lowStockCount > 0 ? 'bg-red-100' : 'bg-gray-100',
//       });
//     }

//     return baseCards;
//   };

//   const cards = getDashboardCards();

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
//         <p className="text-gray-600">Here's what's happening with your inventory today.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cards.map((card, index) => (
//           <Card key={index}>
//             <div className="flex items-center">
//               <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
//                 <card.icon className={`h-6 w-6 ${card.color}`} />
//               </div>
//               <div className="ml-4">
//                 <div className="text-sm font-medium text-gray-500">{card.title}</div>
//                 <div className="text-2xl font-bold text-gray-900">{card.value}</div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {user?.role !== 'Staff' && lowStockCount > 0 && (
//         <Card title="Low Stock Alert" className="border-l-4 border-red-500">
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <div className="flex">
//               <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">
//                   {lowStockCount} products are running low on stock
//                 </h3>
//                 <div className="mt-2 text-sm text-red-700">
//                   <ul className="list-disc pl-5 space-y-1">
//                     {lowStockProducts.slice(0, 5).map((product) => (
//                       <li key={product.id}>
//                         {product.name} - Only {product.quantity} left
//                       </li>
//                     ))}
//                     {lowStockCount > 5 && (
//                       <li>... and {lowStockCount - 5} more items</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       <Card title="Recent Activity (Last 5)">
//           {/* ✅ FIX: Show correct logs based on user role */}
//           {logsLoading ? (
//             <div className="flex items-center justify-center py-4">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//               <span className="ml-2">Loading activity...</span>
//             </div>
//           ) : recentLogs.length === 0 ? (
//             <p className="text-gray-500">No recent activity to display.</p>
//           ) : (
//             <div className="space-y-3">
//               {recentLogs.map((log) => (
//                 <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm font-medium text-gray-900">
//                         {log.productName}
//                       </span>
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         log.change > 0 
//                           ? 'text-green-700 bg-green-100' 
//                           : 'text-red-700 bg-red-100'
//                       }`}>
//                         {getMovementTypeText(log.type)}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {/* ✅ FIX: Show who made the movement and reason */}
//                       <span className="font-medium">{log.userName}</span> • {log.reason}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-sm font-medium ${
//                       log.change > 0 ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       {log.change > 0 ? '+' : ''}{log.change}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {new Date(log.timestamp).toLocaleDateString()}
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {new Date(log.timestamp).toLocaleTimeString()}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>
//         {user?.role !== 'Staff' && lowStockCount > 0 && (
//         <Card title="Quick Actions">
//           <div className="space-y-3">
//             {user?.role === 'Admin' && (
//               <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">
//                 Manage Users
//               </button>
//             )}
//             {(user?.role === 'Manager' || user?.role === 'Admin') && (
//               <>
//                 <button 
//                   onClick={() => setIsExportModalOpen(true)}
//                   className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700"
//                 >
//                   📊 Export Reports (Date Range)
//                 </button>
                
//                 {/* ✅ NEW: Direct Download Section */}
//                 {/* <div className="pt-2 border-t border-gray-100">
//                   <p className="text-xs font-medium text-gray-600 mb-2">Quick Download:</p>
//                   <button
//                     onClick={downloadLogsCSV}
//                     className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700 mb-2"
//                   >
//                     📥 Download All Logs CSV
//                   </button>
//                   <button
//                     onClick={downloadInventoryCSV}
//                     className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700"
//                   >
//                     📦 Download Inventory CSV
//                   </button>
//                 </div> */}
//                  <div className="pt-2">
//                   <DirectDownload />
//                 </div>
//               </>
//             )}
//             {user?.role === 'Staff' && (
//               <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
//                 Record Movement
//               </button>
//             )}
//           </div>
//         </Card>
//         )};

//       </div>

//       {/* Export Reports Modal */}
//       <ExportReportsModal
//         isOpen={isExportModalOpen}
//         onClose={() => setIsExportModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default Dashboard;
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { selectCurrentUser } from '../store/authSlice';
import { 
  useGetProductsQuery, 
  useGetLowStockProductsQuery, 
  useGetAdminLogsQuery,
  useGetUserMovementsQuery  // Add this import
} from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ExportReportsModal from '../components/ExportReportsModal';
import DirectDownload from '../components/DirectDownload';
import { CubeIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
// import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: lowStockProducts = [] } = useGetLowStockProductsQuery(undefined, {
    skip: user?.role === 'Staff'
  });
  
  // ✅ UPDATED: Use different endpoints based on user role
  const { 
    data: adminLogs = [], 
    isLoading: adminLoading,
    error: adminError
  } = useGetAdminLogsQuery(undefined, {
    skip: user?.role === 'Staff'  // Skip for Staff users
  });
  
  const { 
    data: staffLogs = [], 
    isLoading: staffLoading,
    error: staffError
  } = useGetUserMovementsQuery(undefined, {
    skip: user?.role !== 'Staff'  // Only fetch for Staff users
  });
  
  // ✅ Combine logs based on user role
  const allLogs = user?.role === 'Staff' ? staffLogs : adminLogs;
  const logsLoading = user?.role === 'Staff' ? staffLoading : adminLoading;
  const logsError = user?.role === 'Staff' ? staffError : adminError;
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const lowStockCount = lowStockProducts.length;

  // ✅ Get last 5 logs properly
  const recentLogs = allLogs.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

  // Direct download functions
  const downloadLogsCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7273/api/Manager/reports/logs.csv', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download logs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Logs CSV downloaded successfully');
    } catch (error) {
      toast.error('Failed to download logs CSV');
    }
  };

  const downloadInventoryCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7273/api/Manager/reports/inventory.csv', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download inventory');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Inventory CSV downloaded successfully');
    } catch (error) {
      toast.error('Failed to download inventory CSV');
    }
  };

  const getMovementTypeText = (type) => {
    const typeMapping = {
      1: 'Stock In',
      2: 'Stock Out', 
      3: 'Adjustment',
      4: 'Sale',
      5: 'Return',
      6: 'Damage'
    };
    return typeMapping[type] || 'Unknown';
  };

  const getDashboardCards = () => {
    const baseCards = [
      {
        title: 'Total Products',
        value: totalProducts,
        icon: CubeIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        title: 'Total Inventory Value',
        value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        icon: ChartBarIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
    ];

    if (user?.role !== 'Staff') {
      baseCards.push({
        title: 'Low Stock Items',
        value: lowStockCount,
        icon: ExclamationTriangleIcon,
        color: lowStockCount > 0 ? 'text-red-600' : 'text-gray-600',
        bgColor: lowStockCount > 0 ? 'bg-red-100' : 'bg-gray-100',
      });
    }

    return baseCards;
  };

  const cards = getDashboardCards();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-gray-600">Here's what's happening with your inventory today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card key={index}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">{card.title}</div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {user?.role !== 'Staff' && lowStockCount > 0 && (
        <Card title="Low Stock Alert" className="border-l-4 border-red-500">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {lowStockCount} products are running low on stock
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <li key={product.id}>
                        {product.name} - Only {product.quantity} left
                      </li>
                    ))}
                    {lowStockCount > 5 && (
                      <li>... and {lowStockCount - 5} more items</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ UPDATED: Recent Activity now shows for ALL users including Staff */}
        <Card title="Recent Activity (Last 5)">
          {logsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading activity...</span>
            </div>
          ) : logsError ? (
            <div className="text-red-500 text-sm">
              Error loading recent activity. Please try again.
            </div>
          ) : recentLogs.length === 0 ? (
            <p className="text-gray-500">No recent activity to display.</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {log.productName}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.change > 0 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-red-700 bg-red-100'
                      }`}>
                        {getMovementTypeText(log.type)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">{log.userName}</span> - {log.reason}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      log.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {log.change > 0 ? '+' : ''}{log.change}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ✅ Quick Actions Card */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            {user?.role === 'Admin' && (
              <button
      onClick={() => navigate("/admin/users")}
      className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700"
    >
      Manage Users
    </button>
            )}
            {(user?.role === 'Manager' || user?.role === 'Admin') && (
              <>
                <button 
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700"
                >
                  📊 Export Reports (Date Range)
                </button>
                
                <div className="pt-2">
                  <DirectDownload />
                </div>
              </>
            )}
            {user?.role === 'Staff' && (
              // <a href='/staff/movement'>
              <button onClick={() => navigate("/staff/movement")}  className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
                Record Movement
              </button>
              // </a>
            )}
          </div>
        </Card>
      </div>

      {/* Export Reports Modal */}
      <ExportReportsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
