// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { 
//   useGetProductsQuery, 
//   useCreateProductMutation, 
//   useUpdateProductMutation, 
//   useDeleteProductMutation 
// } from '../services/api';
// import { selectCurrentUser } from '../store/authSlice';
// import { useForm } from 'react-hook-form';
// import toast from 'react-hot-toast';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';
// import { PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// const Products = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: products = [], isLoading, refetch } = useGetProductsQuery();
//   const [createProduct] = useCreateProductMutation();
//   const [updateProduct] = useUpdateProductMutation();
//   const [deleteProduct] = useDeleteProductMutation();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Add these new state variables for movement modal
//   const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
//   const [selectedProductForMovements, setSelectedProductForMovements] = useState(null);
//   const [productMovements, setProductMovements] = useState([]);
//   const [loadingMovements, setLoadingMovements] = useState(false);

//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   // Function to handle showing movements
//   const handleShowMovements = async (product) => {
//     setSelectedProductForMovements(product);
//     setIsMovementModalOpen(true);
//     setLoadingMovements(true);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://localhost:7273/api/Staff/movements/${product.id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch movements');
//       }

//       const movements = await response.json();
//       setProductMovements(movements);
//     } catch (error) {
//       console.error('Error fetching movements:', error);
//       toast.error('Failed to load movement data');
//       setProductMovements([]);
//     } finally {
//       setLoadingMovements(false);
//     }
//   };

//   // Function to close movement modal
//   const handleCloseMovementModal = () => {
//     setIsMovementModalOpen(false);
//     setSelectedProductForMovements(null);
//     setProductMovements([]);
//   };

//   // Movement type mapping
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

//   const getMovementTypeColor = (type) => {
//     const colorMapping = {
//       1: 'text-green-600 bg-green-100',
//       2: 'text-red-600 bg-red-100',
//       3: 'text-blue-600 bg-blue-100',
//       4: 'text-purple-600 bg-purple-100',
//       5: 'text-yellow-600 bg-yellow-100',
//       6: 'text-red-600 bg-red-100'
//     };
//     return colorMapping[type] || 'text-gray-600 bg-gray-100';
//   };

//   const onSubmit = async (data) => {
//     try {
//       if (editingProduct) {
//         await updateProduct({ id: editingProduct.id, ...data }).unwrap();
//         toast.success('Product updated successfully');
//       } else {
//         await createProduct(data).unwrap();
//         toast.success('Product created successfully');
//       }
//       handleCloseModal();
//       refetch();
//     } catch (err) {
//       toast.error(err.data?.message || 'Operation failed');
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     reset(product);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await deleteProduct(id).unwrap();
//         toast.success('Product deleted successfully');
//         refetch();
//       } catch (err) {
//         toast.error(err.data?.message || 'Delete failed');
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingProduct(null);
//     reset();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Products</h1>
//         {user?.role === 'Admin' && (
//           <Button onClick={() => setIsModalOpen(true)}>
//             <PlusIcon className="h-5 w-5 mr-2" />
//             Add Product
//           </Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <Card key={product.id}>
//             <div className="space-y-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
//                   <p className="text-sm text-gray-500">{product.category}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   {/* ADD LOGS BUTTON HERE */}
//                   <button
//                     onClick={() => handleShowMovements(product)}
//                     className="text-blue-600 hover:text-blue-900 p-1"
//                     title="View Movement Logs"
//                   >
//                     <ClipboardDocumentListIcon className="h-4 w-4" />
//                   </button>

//                   {(user?.role === 'Manager' || user?.role === 'Admin') && (
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       <PencilIcon className="h-4 w-4" />
//                     </button>
//                   )}
//                   {user?.role === 'Admin' && (
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <TrashIcon className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Price:</span>
//                   <span className="text-sm font-medium">${product.price}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Quantity:</span>
//                   <span className={`text-sm font-medium ${
//                     product.isLowStock ? 'text-red-600' : 'text-green-600'
//                   }`}>
//                     {product.quantity}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">SKU:</span>
//                   <span className="text-sm">{product.sku || 'N/A'}</span>
//                 </div>
//               </div>

//               {product.isLowStock && (
//                 <div className="bg-red-50 border border-red-200 rounded-md p-2">
//                   <p className="text-xs text-red-800">Low Stock Alert!</p>
//                 </div>
//               )}
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Product Movement Modal */}
//       {isMovementModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-gray-900">
//                 Movement Logs - {selectedProductForMovements?.name}
//               </h3>
//               <button
//                 onClick={handleCloseMovementModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//               >
//                 ×
//               </button>
//             </div>

//             {loadingMovements && (
//               <div className="flex items-center justify-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//             )}

//             {!loadingMovements && productMovements.length === 0 && (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No movements found for this product</p>
//               </div>
//             )}

//             {!loadingMovements && productMovements.length > 0 && (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Change
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Quantity
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Reason
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date & Time
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Notes
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {productMovements.map((movement) => (
//                       <tr key={movement.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {movement.userName}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
//                             {getMovementTypeText(movement.type)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <span className={movement.change > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
//                             {movement.change > 0 ? '+' : ''}{movement.change}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {movement.previousQuantity} → {movement.newQuantity}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                           {movement.reason}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           <div>{new Date(movement.timestamp).toLocaleDateString()}</div>
//                           <div className="text-xs text-gray-400">
//                             {new Date(movement.timestamp).toLocaleTimeString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                           {movement.notes || '-'}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <div className="flex justify-end mt-6">
//               <Button onClick={handleCloseMovementModal}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Product Modal - Keep your existing modal code */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               {editingProduct ? 'Edit Product' : 'Add New Product'}
//             </h3>
            
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   {...register('name', { required: 'Name is required' })}
//                   type="text"
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   {...register('description')}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   rows="3"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Price</label>
//                   <input
//                     {...register('price', { 
//                       required: 'Price is required',
//                       valueAsNumber: true,
//                       min: { value: 0.01, message: 'Price must be greater than 0' }
//                     })}
//                     type="number"
//                     step="0.01"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Quantity</label>
//                   <input
//                     {...register('quantity', { 
//                       required: 'Quantity is required',
//                       valueAsNumber: true,
//                       min: { value: 0, message: 'Quantity cannot be negative' }
//                     })}
//                     type="number"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity.message}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Category</label>
//                   <input
//                     {...register('category')}
//                     type="text"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
//                   <input
//                     {...register('lowStockThreshold', { 
//                       valueAsNumber: true,
//                       min: { value: 1, message: 'Threshold must be at least 1' }
//                     })}
//                     type="number"
//                     defaultValue={10}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.lowStockThreshold && <p className="text-red-600 text-sm">{errors.lowStockThreshold.message}</p>}
//                 </div>
//               </div>

//               {!editingProduct && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">SKU</label>
//                   <input
//                     {...register('sku')}
//                     type="text"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               )}

//               <div className="flex justify-end space-x-3 pt-4">
//                 <Button variant="secondary" onClick={handleCloseModal}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">
//                   {editingProduct ? 'Update' : 'Create'}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;
// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { 
//   useGetProductsQuery, 
//   useCreateProductMutation, 
//   useUpdateProductMutation, 
//   useDeleteProductMutation 
// } from '../services/api';
// import { selectCurrentUser } from '../store/authSlice';
// import { useForm } from 'react-hook-form';
// import toast from 'react-hot-toast';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';
// import { PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// const Products = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: products = [], isLoading, refetch } = useGetProductsQuery();
//   const [createProduct] = useCreateProductMutation();
//   const [updateProduct] = useUpdateProductMutation();
//   const [deleteProduct] = useDeleteProductMutation();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Movement Modal States
//   const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
//   const [selectedProductForMovements, setSelectedProductForMovements] = useState(null);
//   const [productMovements, setProductMovements] = useState([]);
//   const [loadingMovements, setLoadingMovements] = useState(false);
//   const [movementsError, setMovementsError] = useState(null);

//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   // Fetch movements when modal opens
//   useEffect(() => {
//     if (isMovementModalOpen && selectedProductForMovements) {
//       setLoadingMovements(true);
//       setMovementsError(null);
      
//       const fetchMovements = async () => {
//         try {
//           const token = localStorage.getItem('token');
//           // console.log(token); // Debugging log
//          const response = await fetch(`https://localhost:7273/api/Staff/movements/product/${selectedProductForMovements.id}`, {
//   headers: {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   }
//   //https://localhost:7273/api/Staff/movements/product/1
// });
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }

//           const movements = await response.json();
//           setProductMovements(movements);
//         } catch (error) {
//           console.error('Error fetching movements:', error);
//           setMovementsError('Failed to load movement data');
//           setProductMovements([]);
//           toast.error('Failed to load movement data');
//         } finally {
//           setLoadingMovements(false);
//         }
//       };

//       fetchMovements();
//     }
//   }, [isMovementModalOpen, selectedProductForMovements]);

//   // Handle showing movements
//   const handleShowMovements = (product) => {
//     setSelectedProductForMovements(product);
//     setIsMovementModalOpen(true);
//   };

//   // Close movement modal
//   const handleCloseMovementModal = () => {
//     setIsMovementModalOpen(false);
//     setSelectedProductForMovements(null);
//     setProductMovements([]);
//     setMovementsError(null);
//   };

//   // Movement type helpers
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

//   const getMovementTypeColor = (type) => {
//     const colorMapping = {
//       1: 'text-green-600 bg-green-100',
//       2: 'text-red-600 bg-red-100',
//       3: 'text-blue-600 bg-blue-100',
//       4: 'text-purple-600 bg-purple-100',
//       5: 'text-yellow-600 bg-yellow-100',
//       6: 'text-red-600 bg-red-100'
//     };
//     return colorMapping[type] || 'text-gray-600 bg-gray-100';
//   };

//   const onSubmit = async (data) => {
//     try {
//       if (editingProduct) {
//         await updateProduct({ id: editingProduct.id, ...data }).unwrap();
//         toast.success('Product updated successfully');
//       } else {
//         await createProduct(data).unwrap();
//         toast.success('Product created successfully');
//       }
//       handleCloseModal();
//       refetch();
//     } catch (err) {
//       toast.error(err.data?.message || 'Operation failed');
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     reset(product);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await deleteProduct(id).unwrap();
//         toast.success('Product deleted successfully');
//         refetch();
//       } catch (err) {
//         toast.error(err.data?.message || 'Delete failed');
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingProduct(null);
//     reset();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Products</h1>
//         {user?.role === 'Admin' && (
//           <Button onClick={() => setIsModalOpen(true)}>
//             <PlusIcon className="h-5 w-5 mr-2" />
//             Add Product
//           </Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <Card key={product.id}>
//             <div className="space-y-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
//                   <p className="text-sm text-gray-500">{product.category || 'No Category'}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   {/* LOGS BUTTON */}
//                   <button
//                     onClick={() => handleShowMovements(product)}
//                     className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                     title="View Movement Logs"
//                   >
//                     <ClipboardDocumentListIcon className="h-4 w-4" />
//                   </button>

//                   {(user?.role === 'Manager' || user?.role === 'Admin') && (
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                     >
//                       <PencilIcon className="h-4 w-4" />
//                     </button>
//                   )}
//                   {user?.role === 'Admin' && (
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="text-red-600 hover:text-red-900 p-1 rounded"
//                     >
//                       <TrashIcon className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Price:</span>
//                   <span className="text-sm font-medium">${product.price}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Quantity:</span>
//                   <span className={`text-sm font-medium ${
//                     product.isLowStock ? 'text-red-600' : 'text-green-600'
//                   }`}>
//                     {product.quantity}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">SKU:</span>
//                   <span className="text-sm">{product.sku || 'N/A'}</span>
//                 </div>
//                 {product.description && (
//                   <div className="pt-2 border-t border-gray-100">
//                     <p className="text-xs text-gray-600">{product.description}</p>
//                   </div>
//                 )}
//               </div>

//               {product.isLowStock && (
//                 <div className="bg-red-50 border border-red-200 rounded-md p-2">
//                   <p className="text-xs text-red-800 font-medium">⚠️ Low Stock Alert!</p>
//                 </div>
//               )}
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Product Movement Modal */}
//       {isMovementModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-gray-900">
//                 Movement Logs - {selectedProductForMovements?.name}
//               </h3>
//               <button
//                 onClick={handleCloseMovementModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//               >
//                 ×
//               </button>
//             </div>

//             {loadingMovements && (
//               <div className="flex items-center justify-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <span className="ml-2">Loading movements...</span>
//               </div>
//             )}

//             {movementsError && (
//               <div className="text-center py-8">
//                 <p className="text-red-500">{movementsError}</p>
//                 <Button 
//                   onClick={() => handleShowMovements(selectedProductForMovements)} 
//                   variant="secondary" 
//                   className="mt-2"
//                 >
//                   Retry
//                 </Button>
//               </div>
//             )}

//             {!loadingMovements && !movementsError && productMovements.length === 0 && (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No movements found for this product</p>
//               </div>
//             )}

//             {!loadingMovements && !movementsError && productMovements.length > 0 && (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Change
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Quantity
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Reason
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date & Time
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Notes
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {productMovements.map((movement) => (
//                       <tr key={movement.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {movement.userName}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
//                             {getMovementTypeText(movement.type)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <span className={movement.change > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
//                             {movement.change > 0 ? '+' : ''}{movement.change}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {movement.previousQuantity} → {movement.newQuantity}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                           {movement.reason}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           <div>{new Date(movement.timestamp).toLocaleDateString()}</div>
//                           <div className="text-xs text-gray-400">
//                             {new Date(movement.timestamp).toLocaleTimeString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                           {movement.notes || '-'}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <div className="flex justify-end mt-6">
//               <Button onClick={handleCloseMovementModal}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Product Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               {editingProduct ? 'Edit Product' : 'Add New Product'}
//             </h3>
            
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   {...register('name', { required: 'Name is required' })}
//                   type="text"
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   {...register('description')}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   rows="3"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Price</label>
//                   <input
//                     {...register('price', { 
//                       required: 'Price is required',
//                       valueAsNumber: true,
//                       min: { value: 0.01, message: 'Price must be greater than 0' }
//                     })}
//                     type="number"
//                     step="0.01"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Quantity</label>
//                   <input
//                     {...register('quantity', { 
//                       required: 'Quantity is required',
//                       valueAsNumber: true,
//                       min: { value: 0, message: 'Quantity cannot be negative' }
//                     })}
//                     type="number"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity.message}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Category</label>
//                   <input
//                     {...register('category')}
//                     type="text"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
//                   <input
//                     {...register('lowStockThreshold', { 
//                       valueAsNumber: true,
//                       min: { value: 1, message: 'Threshold must be at least 1' }
//                     })}
//                     type="number"
//                     defaultValue={10}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.lowStockThreshold && <p className="text-red-600 text-sm">{errors.lowStockThreshold.message}</p>}
//                 </div>
//               </div>

//               {!editingProduct && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">SKU</label>
//                   <input
//                     {...register('sku')}
//                     type="text"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               )}

//               <div className="flex justify-end space-x-3 pt-4">
//                 <Button variant="secondary" onClick={handleCloseModal}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">
//                   {editingProduct ? 'Update' : 'Create'}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;




//******** */
// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { 
//   useGetProductsQuery, 
//   useCreateProductMutation, 
//   useUpdateProductMutation, 
//   useDeleteProductMutation 
// } from '../services/api';
// import { selectCurrentUser } from '../store/authSlice';
// import { useForm } from 'react-hook-form';
// import toast from 'react-hot-toast';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';
// import { PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon, QrCodeIcon } from '@heroicons/react/24/outline';

// const Products = () => {
//   const user = useSelector(selectCurrentUser);
//   const { data: products = [], isLoading, refetch } = useGetProductsQuery();
//   const [createProduct] = useCreateProductMutation();
//   const [updateProduct] = useUpdateProductMutation();
//   const [deleteProduct] = useDeleteProductMutation();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Movement Modal States
//   const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
//   const [selectedProductForMovements, setSelectedProductForMovements] = useState(null);
//   const [productMovements, setProductMovements] = useState([]);
//   const [loadingMovements, setLoadingMovements] = useState(false);
//   const [movementsError, setMovementsError] = useState(null);

//   // Code Modal States
//   const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
//   const [selectedProductForCode, setSelectedProductForCode] = useState(null);
//   const [codeType, setCodeType] = useState('qr'); // 'qr' or 'barcode'

//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   // Fetch movements when modal opens
//   useEffect(() => {
//     if (isMovementModalOpen && selectedProductForMovements) {
//       setLoadingMovements(true);
//       setMovementsError(null);
      
//       const fetchMovements = async () => {
//         try {
//           const token = localStorage.getItem('token');
//           const response = await fetch(`https://localhost:7273/api/Staff/movements/product/${selectedProductForMovements.id}`, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }

//           const movements = await response.json();
//           setProductMovements(movements);
//         } catch (error) {
//           console.error('Error fetching movements:', error);
//           setMovementsError('Failed to load movement data');
//           setProductMovements([]);
//           toast.error('Failed to load movement data');
//         } finally {
//           setLoadingMovements(false);
//         }
//       };

//       fetchMovements();
//     }
//   }, [isMovementModalOpen, selectedProductForMovements]);

//   // Handle showing code modal
//   const handleShowCode = (product) => {
//     setSelectedProductForCode(product);
//     setIsCodeModalOpen(true);
//     setCodeType('qr'); // Default to QR code
//   };

//   // Close code modal
//   const handleCloseCodeModal = () => {
//     setIsCodeModalOpen(false);
//     setSelectedProductForCode(null);
//     setCodeType('qr');
//   };

//   // Generate QR Code URL
//   const generateQRCode = (product) => {
//     const productInfo = `Product: ${product.name}\nSKU: ${product.sku || 'N/A'}\nPrice: $${product.price}\nCategory: ${product.category || 'N/A'}`;
//     const encodedData = encodeURIComponent(productInfo);
//     return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
//   };

//   // Generate Barcode URL (using Code128 format)
//   const generateBarcode = (product) => {
//     // Use SKU if available, otherwise use product ID
//     const barcodeData = product.sku || `PROD${product.id}`;
//     return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(barcodeData)}&code=Code128&translate-esc=on&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=000000&bgcolor=FFFFFF&qunit=Mm&quiet=0`;
//   };

//   // Download code image
//   const downloadCodeImage = async (url, filename) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(downloadUrl);
//       toast.success('Code downloaded successfully');
//     } catch (error) {
//       console.error('Download failed:', error);
//       toast.error('Failed to download code');
//     }
//   };

//   // Handle showing movements
//   const handleShowMovements = (product) => {
//     setSelectedProductForMovements(product);
//     setIsMovementModalOpen(true);
//   };

//   // Close movement modal
//   const handleCloseMovementModal = () => {
//     setIsMovementModalOpen(false);
//     setSelectedProductForMovements(null);
//     setProductMovements([]);
//     setMovementsError(null);
//   };

//   // Movement type helpers
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

//   const getMovementTypeColor = (type) => {
//     const colorMapping = {
//       1: 'text-green-600 bg-green-100',
//       2: 'text-red-600 bg-red-100',
//       3: 'text-blue-600 bg-blue-100',
//       4: 'text-purple-600 bg-purple-100',
//       5: 'text-yellow-600 bg-yellow-100',
//       6: 'text-red-600 bg-red-100'
//     };
//     return colorMapping[type] || 'text-gray-600 bg-gray-100';
//   };

//   const onSubmit = async (data) => {
//     try {
//       if (editingProduct) {
//         await updateProduct({ id: editingProduct.id, ...data }).unwrap();
//         toast.success('Product updated successfully');
//       } else {
//         await createProduct(data).unwrap();
//         toast.success('Product created successfully');
//       }
//       handleCloseModal();
//       refetch();
//     } catch (err) {
//       toast.error(err.data?.message || 'Operation failed');
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     reset(product);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await deleteProduct(id).unwrap();
//         toast.success('Product deleted successfully');
//         refetch();
//       } catch (err) {
//         toast.error(err.data?.message || 'Delete failed');
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingProduct(null);
//     reset();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Products</h1>
//         {user?.role === 'Admin' && (
//           <Button onClick={() => setIsModalOpen(true)}>
//             <PlusIcon className="h-5 w-5 mr-2" />
//             Add Product
//           </Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <Card key={product.id}>
//             <div className="space-y-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
//                   <p className="text-sm text-gray-500">{product.category || 'No Category'}</p>
//                 </div>
//                 <div className="flex space-x-1">
//                   {/* SHOW CODE BUTTON */}
//                   <button
//                     onClick={() => handleShowCode(product)}
//                     className="text-purple-600 hover:text-purple-900 p-1 rounded"
//                     title="Show Product Code"
//                   >
//                     <QrCodeIcon className="h-4 w-4" />
//                   </button>

//                   {/* LOGS BUTTON */}
//                   <button
//                     onClick={() => handleShowMovements(product)}
//                     className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                     title="View Movement Logs"
//                   >
//                     <ClipboardDocumentListIcon className="h-4 w-4" />
//                   </button>

//                   {(user?.role === 'Manager' || user?.role === 'Admin') && (
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                     >
//                       <PencilIcon className="h-4 w-4" />
//                     </button>
//                   )}
//                   {user?.role === 'Admin' && (
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="text-red-600 hover:text-red-900 p-1 rounded"
//                     >
//                       <TrashIcon className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Price:</span>
//                   <span className="text-sm font-medium">${product.price}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Quantity:</span>
//                   <span className={`text-sm font-medium ${
//                     product.isLowStock ? 'text-red-600' : 'text-green-600'
//                   }`}>
//                     {product.quantity}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">SKU:</span>
//                   <span className="text-sm">{product.sku || 'N/A'}</span>
//                 </div>
//                 {product.description && (
//                   <div className="pt-2 border-t border-gray-100">
//                     <p className="text-xs text-gray-600">{product.description}</p>
//                   </div>
//                 )}
//               </div>

//               {product.isLowStock && (
//                 <div className="bg-red-50 border border-red-200 rounded-md p-2">
//                   <p className="text-xs text-red-800 font-medium">⚠️ Low Stock Alert!</p>
//                 </div>
//               )}
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Product Code Modal */}
//       {isCodeModalOpen && selectedProductForCode && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-6 border w-96 shadow-lg rounded-md bg-white">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-gray-900">
//                 Product Code - {selectedProductForCode.name}
//               </h3>
//               <button
//                 onClick={handleCloseCodeModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Code Type Selection */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Code Type:</label>
//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => setCodeType('qr')}
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${
//                     codeType === 'qr' 
//                       ? 'bg-blue-600 text-white' 
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   QR Code
//                 </button>
//                 <button
//                   onClick={() => setCodeType('barcode')}
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${
//                     codeType === 'barcode' 
//                       ? 'bg-blue-600 text-white' 
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   Barcode
//                 </button>
//               </div>
//             </div>

//             {/* Code Display */}
//             <div className="text-center mb-4">
//               <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 {codeType === 'qr' ? (
//                   <img
//                     src={generateQRCode(selectedProductForCode)}
//                     alt="QR Code"
//                     className="mx-auto border"
//                     style={{ maxWidth: '200px', height: 'auto' }}
//                   />
//                 ) : (
//                   <img
//                     src={generateBarcode(selectedProductForCode)}
//                     alt="Barcode"
//                     className="mx-auto border"
//                     style={{ maxWidth: '300px', height: 'auto' }}
//                   />
//                 )}
//               </div>
              
//               {/* Product Information */}
//               <div className="text-left bg-white border rounded-lg p-3">
//                 <h4 className="font-medium text-gray-900 mb-2">Product Information:</h4>
//                 <div className="space-y-1 text-sm text-gray-600">
//                   <div><span className="font-medium">Name:</span> {selectedProductForCode.name}</div>
//                   <div><span className="font-medium">SKU:</span> {selectedProductForCode.sku || 'N/A'}</div>
//                   <div><span className="font-medium">Price:</span> ${selectedProductForCode.price}</div>
//                   <div><span className="font-medium">Category:</span> {selectedProductForCode.category || 'N/A'}</div>
//                   {codeType === 'barcode' && (
//                     <div><span className="font-medium">Barcode Data:</span> {selectedProductForCode.sku || `PROD${selectedProductForCode.id}`}</div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-between space-x-3">
//               <Button 
//                 variant="secondary" 
//                 onClick={() => downloadCodeImage(
//                   codeType === 'qr' ? generateQRCode(selectedProductForCode) : generateBarcode(selectedProductForCode),
//                   `${selectedProductForCode.name}_${codeType}_${Date.now()}.${codeType === 'qr' ? 'png' : 'gif'}`
//                 )}
//               >
//                 Download {codeType === 'qr' ? 'QR Code' : 'Barcode'}
//               </Button>
//               <Button onClick={handleCloseCodeModal}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Movement Modal */}
//       {isMovementModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-gray-900">
//                 Movement Logs - {selectedProductForMovements?.name}
//               </h3>
//               <button
//                 onClick={handleCloseMovementModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//               >
//                 ×
//               </button>
//             </div>

//             {loadingMovements && (
//               <div className="flex items-center justify-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <span className="ml-2">Loading movements...</span>
//               </div>
//             )}

//             {movementsError && (
//               <div className="text-center py-8">
//                 <p className="text-red-500">{movementsError}</p>
//                 <Button 
//                   onClick={() => handleShowMovements(selectedProductForMovements)} 
//                   variant="secondary" 
//                   className="mt-2"
//                 >
//                   Retry
//                 </Button>
//               </div>
//             )}

//             {!loadingMovements && !movementsError && productMovements.length === 0 && (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No movements found for this product</p>
//               </div>
//             )}

//             {!loadingMovements && !movementsError && productMovements.length > 0 && (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Change
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Quantity
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Reason
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date & Time
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Notes
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {productMovements.map((movement) => (
//                       <tr key={movement.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {movement.userName}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
//                             {getMovementTypeText(movement.type)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <span className={movement.change > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
//                             {movement.change > 0 ? '+' : ''}{movement.change}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {movement.previousQuantity} → {movement.newQuantity}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                           {movement.reason}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           <div>{new Date(movement.timestamp).toLocaleDateString()}</div>
//                           <div className="text-xs text-gray-400">
//                             {new Date(movement.timestamp).toLocaleTimeString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                           {movement.notes || '-'}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <div className="flex justify-end mt-6">
//               <Button onClick={handleCloseMovementModal}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Product Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               {editingProduct ? 'Edit Product' : 'Add New Product'}
//             </h3>
            
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   {...register('name', { required: 'Name is required' })}
//                   type="text"
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   {...register('description')}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   rows="3"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Price</label>
//                   <input
//                     {...register('price', { 
//                       required: 'Price is required',
//                       valueAsNumber: true,
//                       min: { value: 0.01, message: 'Price must be greater than 0' }
//                     })}
//                     type="number"
//                     step="0.01"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Quantity</label>
//                   <input
//                     {...register('quantity', { 
//                       required: 'Quantity is required',
//                       valueAsNumber: true,
//                       min: { value: 0, message: 'Quantity cannot be negative' }
//                     })}
//                     type="number"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity.message}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Category</label>
//                   <input
//                     {...register('category')}
//                     type="text"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
//                   <input
//                     {...register('lowStockThreshold', { 
//                       valueAsNumber: true,
//                       min: { value: 1, message: 'Threshold must be at least 1' }
//                     })}
//                     type="number"
//                     defaultValue={10}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.lowStockThreshold && <p className="text-red-600 text-sm">{errors.lowStockThreshold.message}</p>}
//                 </div>
//               </div>

//               {!editingProduct && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">SKU</label>
//                   <input
//                     {...register('sku')}
//                     type="text"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               )}

//               <div className="flex justify-end space-x-3 pt-4">
//                 <Button variant="secondary" onClick={handleCloseModal}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">
//                   {editingProduct ? 'Update' : 'Create'}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetProductsQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from '../services/api';
import { selectCurrentUser } from '../store/authSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { PlusIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon, QrCodeIcon } from '@heroicons/react/24/outline';

const Products = () => {
  const user = useSelector(selectCurrentUser);
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Movement Modal States
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProductForMovements, setSelectedProductForMovements] = useState(null);
  const [productMovements, setProductMovements] = useState([]);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [movementsError, setMovementsError] = useState(null);

  // Code Modal States
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [selectedProductForCode, setSelectedProductForCode] = useState(null);
  const [codeType, setCodeType] = useState('qr'); // 'qr' or 'barcode'

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch movements when modal opens
  useEffect(() => {
    if (isMovementModalOpen && selectedProductForMovements) {
      setLoadingMovements(true);
      setMovementsError(null);
      
      const fetchMovements = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://localhost:7273/api/Staff/movements/product/${selectedProductForMovements.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const movements = await response.json();
          setProductMovements(movements);
        } catch (error) {
          console.error('Error fetching movements:', error);
          setMovementsError('Failed to load movement data');
          setProductMovements([]);
          toast.error('Failed to load movement data');
        } finally {
          setLoadingMovements(false);
        }
      };

      fetchMovements();
    }
  }, [isMovementModalOpen, selectedProductForMovements]);

  // Handle showing code modal
  const handleShowCode = (product) => {
    setSelectedProductForCode(product);
    setIsCodeModalOpen(true);
    setCodeType('qr'); // Default to QR code
  };

  // Close code modal
  const handleCloseCodeModal = () => {
    setIsCodeModalOpen(false);
    setSelectedProductForCode(null);
    setCodeType('qr');
  };

  // Generate QR Code URL
  const generateQRCode = (product) => {
    const productInfo = `Product: ${product.name}\nSKU: ${product.sku || 'N/A'}\nPrice: $${product.price}\nCategory: ${product.category || 'N/A'}`;
    const encodedData = encodeURIComponent(productInfo);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
  };

  // Generate Barcode URL (using Code128 format)
  const generateBarcode = (product) => {
    // Use SKU if available, otherwise use product ID
    const barcodeData = product.sku || `PROD${product.id}`;
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(barcodeData)}&code=Code128&translate-esc=on&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=000000&bgcolor=FFFFFF&qunit=Mm&quiet=0`;
  };

  // Download code image
  const downloadCodeImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('Code downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download code');
    }
  };

  // Handle showing movements
  const handleShowMovements = (product) => {
    setSelectedProductForMovements(product);
    setIsMovementModalOpen(true);
  };

  // Close movement modal
  const handleCloseMovementModal = () => {
    setIsMovementModalOpen(false);
    setSelectedProductForMovements(null);
    setProductMovements([]);
    setMovementsError(null);
  };

  // Movement type helpers
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

  const getMovementTypeColor = (type) => {
    const colorMapping = {
      1: 'text-green-600 bg-green-100',
      2: 'text-red-600 bg-red-100',
      3: 'text-blue-600 bg-blue-100',
      4: 'text-purple-600 bg-purple-100',
      5: 'text-yellow-600 bg-yellow-100',
      6: 'text-red-600 bg-red-100'
    };
    return colorMapping[type] || 'text-gray-600 bg-gray-100';
  };

  const onSubmit = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, ...data }).unwrap();
        toast.success('Product updated successfully');
      } else {
        await createProduct(data).unwrap();
        toast.success('Product created successfully');
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err.data?.message || 'Delete failed');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        {user?.role === 'Admin' && (
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category || 'No Category'}</p>
                </div>
                <div className="flex space-x-2">
                  {/* SHOW CODE BUTTON */}
                  <button
                    onClick={() => handleShowCode(product)}
                    className="rounded-md p-1 text-purple-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                    title="Show Product Code"
                  >
                    <QrCodeIcon className="h-5 w-5" />
                  </button>

                  {/* LOGS BUTTON */}
                  <button
                    onClick={() => handleShowMovements(product)}
                    className="rounded-md p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    title="View Movement Logs"
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                  </button>

                  {(user?.role === 'Manager' || user?.role === 'Admin') && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="rounded-md p-1 text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  {user?.role === 'Admin' && (
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-md p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className={`font-medium ${product.isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                    {product.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SKU:</span>
                  <span className="text-gray-900">{product.sku || 'N/A'}</span>
                </div>
                {product.description && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                  </div>
                )}
              </div>

              {product.isLowStock && (
                <div className="mt-4 rounded-md bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">⚠️ Low Stock Alert!</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Product Code Modal */}
      {isCodeModalOpen && selectedProductForCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Product Code - {selectedProductForCode.name}
              </h3>
              <button
                onClick={handleCloseCodeModal}
                className="text-gray-400 transition hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Code Type Selection */}
            <div className="p-6">
              <label className="mb-3 block text-sm font-medium text-gray-700">Code Type:</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCodeType('qr')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    codeType === 'qr' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  QR Code
                </button>
                <button
                  onClick={() => setCodeType('barcode')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    codeType === 'barcode' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Barcode
                </button>
              </div>

              {/* Code Display */}
              <div className="mt-6 text-center">
                <div className="mb-4 rounded-lg bg-gray-50 p-4 shadow-inner">
                  {codeType === 'qr' ? (
                    <img
                      src={generateQRCode(selectedProductForCode)}
                      alt="QR Code"
                      className="mx-auto max-w-[200px] rounded-md border border-gray-200"
                    />
                  ) : (
                    <img
                      src={generateBarcode(selectedProductForCode)}
                      alt="Barcode"
                      className="mx-auto max-w-[300px] rounded-md border border-gray-200"
                    />
                  )}
                </div>
                
                {/* Product Information */}
                <div className="rounded-lg bg-gray-50 p-4 text-left shadow-inner">
                  <h4 className="mb-3 font-medium text-gray-900">Product Information:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><span className="font-medium">Name:</span> {selectedProductForCode.name}</div>
                    <div><span className="font-medium">SKU:</span> {selectedProductForCode.sku || 'N/A'}</div>
                    <div><span className="font-medium">Price:</span> ${selectedProductForCode.price}</div>
                    <div><span className="font-medium">Category:</span> {selectedProductForCode.category || 'N/A'}</div>
                    {codeType === 'barcode' && (
                      <div><span className="font-medium">Barcode Data:</span> {selectedProductForCode.sku || `PROD${selectedProductForCode.id}`}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-4">
                <Button 
                  variant="secondary" 
                  onClick={() => downloadCodeImage(
                    codeType === 'qr' ? generateQRCode(selectedProductForCode) : generateBarcode(selectedProductForCode),
                    `${selectedProductForCode.name}_${codeType}_${Date.now()}.${codeType === 'qr' ? 'png' : 'gif'}`
                  )}
                  className="flex-1 rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                >
                  Download {codeType === 'qr' ? 'QR Code' : 'Barcode'}
                </Button>
                <Button 
                  onClick={handleCloseCodeModal}
                  className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Movement Modal */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="mx-4 w-full max-w-6xl rounded-xl bg-white shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Movement Logs - {selectedProductForMovements?.name}
              </h3>
              <button
                onClick={handleCloseMovementModal}
                className="text-gray-400 transition hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {loadingMovements && (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading movements...</span>
                </div>
              )}

              {movementsError && (
                <div className="text-center py-8">
                  <p className="text-red-500">{movementsError}</p>
                  <Button 
                    onClick={() => handleShowMovements(selectedProductForMovements)} 
                    variant="secondary" 
                    className="mt-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {!loadingMovements && !movementsError && productMovements.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No movements found for this product
                </div>
              )}

              {!loadingMovements && !movementsError && productMovements.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {productMovements.map((movement) => (
                        <tr key={movement.id} className="transition hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{movement.userName}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getMovementTypeColor(movement.type)}`}>
                              {getMovementTypeText(movement.type)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            <span className={movement.change > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {movement.change > 0 ? '+' : ''}{movement.change}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {movement.previousQuantity} → {movement.newQuantity}
                          </td>
                          <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">{movement.reason}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            <div>{new Date(movement.timestamp).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">{new Date(movement.timestamp).toLocaleTimeString()}</div>
                          </td>
                          <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">{movement.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleCloseMovementModal}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="p-6">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description')}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
                    <input
                      {...register('price', { 
                        required: 'Price is required',
                        valueAsNumber: true,
                        min: { value: 0.01, message: 'Price must be greater than 0' }
                      })}
                      type="number"
                      step="0.01"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      {...register('quantity', { 
                        required: 'Quantity is required',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Quantity cannot be negative' }
                      })}
                      type="number"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                    <input
                      {...register('category')}
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                    <input
                      {...register('lowStockThreshold', { 
                        valueAsNumber: true,
                        min: { value: 1, message: 'Threshold must be at least 1' }
                      })}
                      type="number"
                      defaultValue={10}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.lowStockThreshold && <p className="mt-1 text-sm text-red-600">{errors.lowStockThreshold.message}</p>}
                  </div>
                </div>

                {!editingProduct && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">SKU</label>
                    <input
                      {...register('sku')}
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="secondary" 
                    onClick={handleCloseModal}
                    className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
