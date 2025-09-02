// import React, { useState } from 'react';
// import Button from './ui/Button';
// import toast from 'react-hot-toast';

// const ExportReportsModal = ({ isOpen, onClose }) => {
//   const [logsDateRange, setLogsDateRange] = useState({
//     startDate: '',
//     endDate: ''
//   });
  
//   const [inventoryDateRange, setInventoryDateRange] = useState({
//     startDate: '',
//     endDate: ''
//   });
  
//   const [loadingLogs, setLoadingLogs] = useState(false);
//   const [loadingInventory, setLoadingInventory] = useState(false);

//   // Function to convert data to CSV format
//   const convertToCSV = (data, headers) => {
//     const csvHeaders = headers.join(',');
//     const csvData = data.map(row => 
//       headers.map(header => {
//         const value = row[header.toLowerCase().replace(/\s+/g, '')];
//         return `"${value || ''}"`;
//       }).join(',')
//     ).join('\n');
    
//     return `${csvHeaders}\n${csvData}`;
//   };

//   // Function to download CSV file
//   const downloadCSV = (csvContent, filename) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
    
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     }
//   };

//   // Download Logs CSV
//   const handleDownloadLogs = async () => {
//     if (!logsDateRange.startDate || !logsDateRange.endDate) {
//       toast.error('Please select both start and end dates for logs');
//       return;
//     }

//     setLoadingLogs(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`https://localhost:7273/api/Manager/reports/logs.csv`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch logs');
//       }

//       const allLogs = await response.json();
      
//       // Filter logs by date range
//       const filteredLogs = allLogs.filter(log => {
//         const logDate = new Date(log.timestamp);
//         const startDate = new Date(logsDateRange.startDate);
//         const endDate = new Date(logsDateRange.endDate);
//         endDate.setHours(23, 59, 59, 999); // Include full end day
        
//         return logDate >= startDate && logDate <= endDate;
//       });

//       if (filteredLogs.length === 0) {
//         toast.info('No logs found for the selected date range');
//         return;
//       }

//       // Define CSV headers
//       const headers = [
//         'ID', 'Product Name', 'User Name', 'Movement Type', 'Change', 
//         'Previous Quantity', 'New Quantity', 'Reason', 'Date', 'Notes'
//       ];

//       // Format data for CSV
//       const csvData = filteredLogs.map(log => ({
//         id: log.id,
//         productname: log.productName,
//         username: log.userName,
//         movementtype: getMovementTypeText(log.type),
//         change: log.change,
//         previousquantity: log.previousQuantity,
//         newquantity: log.newQuantity,
//         reason: log.reason,
//         date: new Date(log.timestamp).toLocaleDateString(),
//         notes: log.notes || ''
//       }));

//       const csvContent = convertToCSV(csvData, headers);
//       const filename = `logs_${logsDateRange.startDate}_to_${logsDateRange.endDate}.csv`;
      
//       downloadCSV(csvContent, filename);
//       toast.success(`Downloaded ${filteredLogs.length} log entries`);
      
//     } catch (error) {
//       console.error('Error downloading logs:', error);
//       toast.error('Failed to download logs CSV');
//     } finally {
//       setLoadingLogs(false);
//     }
//   };

//   // Download Inventory CSV
//   const handleDownloadInventory = async () => {
//     if (!inventoryDateRange.startDate || !inventoryDateRange.endDate) {
//       toast.error('Please select both start and end dates for inventory');
//       return;
//     }

//     setLoadingInventory(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`https://localhost:7273/api/Manager/reports/inventory.csv`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch inventory');
//       }

//       const allProducts = await response.json();
      
//       // Filter products by date range (using updatedAt or createdAt)
//       const filteredProducts = allProducts.filter(product => {
//         const productDate = new Date(product.updatedAt || product.createdAt);
//         const startDate = new Date(inventoryDateRange.startDate);
//         const endDate = new Date(inventoryDateRange.endDate);
//         endDate.setHours(23, 59, 59, 999);
        
//         return productDate >= startDate && productDate <= endDate;
//       });

//       if (filteredProducts.length === 0) {
//         toast.info('No inventory changes found for the selected date range');
//         return;
//       }

//       // Define CSV headers
//       const headers = [
//         'ID', 'Name', 'Category', 'SKU', 'Price', 'Quantity', 
//         'Low Stock Threshold', 'Is Low Stock', 'Last Updated'
//       ];

//       // Format data for CSV
//       const csvData = filteredProducts.map(product => ({
//         id: product.id,
//         name: product.name,
//         category: product.category || '',
//         sku: product.sku || '',
//         price: product.price,
//         quantity: product.quantity,
//         lowstockthreshold: product.lowStockThreshold,
//         islowstock: product.isLowStock ? 'Yes' : 'No',
//         lastupdated: new Date(product.updatedAt || product.createdAt).toLocaleDateString()
//       }));

//       const csvContent = convertToCSV(csvData, headers);
//       const filename = `inventory_${inventoryDateRange.startDate}_to_${inventoryDateRange.endDate}.csv`;
      
//       downloadCSV(csvContent, filename);
//       toast.success(`Downloaded ${filteredProducts.length} inventory items`);
      
//     } catch (error) {
//       console.error('Error downloading inventory:', error);
//       toast.error('Failed to download inventory CSV');
//     } finally {
//       setLoadingInventory(false);
//     }
//   };

//   // Helper function for movement types
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

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-20 mx-auto p-6 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-bold text-gray-900">Export Reports</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//           >
//             ×
//           </button>
//         </div>

//         <div className="space-y-8">
//           {/* Logs Export Section */}
//           <div className="border border-gray-200 rounded-lg p-4">
//             <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               📋 Export Inventory Logs CSV
//             </h4>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={logsDateRange.startDate}
//                   onChange={(e) => setLogsDateRange({...logsDateRange, startDate: e.target.value})}
//                   max={logsDateRange.endDate || new Date().toISOString().split('T')[0]}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={logsDateRange.endDate}
//                   onChange={(e) => setLogsDateRange({...logsDateRange, endDate: e.target.value})}
//                   min={logsDateRange.startDate}
//                   max={new Date().toISOString().split('T')[0]}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
            
//             <Button
//               onClick={handleDownloadLogs}
//               disabled={loadingLogs}
//               className="w-full bg-blue-600 hover:bg-blue-700"
//             >
//               {loadingLogs ? 'Downloading...' : '📥 Download Logs CSV'}
//             </Button>
//           </div>

//           {/* Inventory Export Section */}
//           <div className="border border-gray-200 rounded-lg p-4">
//             <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               📦 Export Inventory CSV
//             </h4>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={inventoryDateRange.startDate}
//                   onChange={(e) => setInventoryDateRange({...inventoryDateRange, startDate: e.target.value})}
//                   max={inventoryDateRange.endDate || new Date().toISOString().split('T')[0]}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={inventoryDateRange.endDate}
//                   onChange={(e) => setInventoryDateRange({...inventoryDateRange, endDate: e.target.value})}
//                   min={inventoryDateRange.startDate}
//                   max={new Date().toISOString().split('T')[0]}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
            
//             <Button
//               onClick={handleDownloadInventory}
//               disabled={loadingInventory}
//               className="w-full bg-green-600 hover:bg-green-700"
//             >
//               {loadingInventory ? 'Downloading...' : '📥 Download Inventory CSV'}
//             </Button>
//           </div>
//         </div>

//         <div className="flex justify-end mt-6">
//           <Button onClick={onClose} variant="secondary">
//             Close
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExportReportsModal;
import React, { useState } from 'react';
import Button from './ui/Button';
import toast from 'react-hot-toast';

const ExportReportsModal = ({ isOpen, onClose }) => {
  const [logsDateRange, setLogsDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [inventoryDateRange, setInventoryDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);

  // Download Logs CSV
  const handleDownloadLogs = async () => {
    if (!logsDateRange.startDate || !logsDateRange.endDate) {
      toast.error('Please select both start and end dates for logs');
      return;
    }

    setLoadingLogs(true);
    try {
      const token = localStorage.getItem('token');
      const url = new URL('http://localhost:7273/api/Reports/logs.csv');
      url.searchParams.append('startDate', logsDateRange.startDate);
      url.searchParams.append('endDate', logsDateRange.endDate);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Download the file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Get filename from response header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `logs_${logsDateRange.startDate}_to_${logsDateRange.endDate}.csv`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Logs CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading logs:', error);
      toast.error('Failed to download logs CSV: ' + error.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Download Inventory CSV
  const handleDownloadInventory = async () => {
    if (!inventoryDateRange.startDate || !inventoryDateRange.endDate) {
      toast.error('Please select both start and end dates for inventory');
      return;
    }

    setLoadingInventory(true);
    try {
      const token = localStorage.getItem('token');
      const url = new URL('http://localhost:7273/api/Reports/inventory.csv');
      url.searchParams.append('startDate', inventoryDateRange.startDate);
      url.searchParams.append('endDate', inventoryDateRange.endDate);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Download the file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Get filename from response header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `inventory_${inventoryDateRange.startDate}_to_${inventoryDateRange.endDate}.csv`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Inventory CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading inventory:', error);
      toast.error('Failed to download inventory CSV: ' + error.message);
    } finally {
      setLoadingInventory(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Export Reports</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-8">
          {/* Logs Export Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              📋 Export Inventory Logs CSV
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={logsDateRange.startDate}
                  onChange={(e) => setLogsDateRange({...logsDateRange, startDate: e.target.value})}
                  max={logsDateRange.endDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={logsDateRange.endDate}
                  onChange={(e) => setLogsDateRange({...logsDateRange, endDate: e.target.value})}
                  min={logsDateRange.startDate}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <Button
              onClick={handleDownloadLogs}
              disabled={loadingLogs}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loadingLogs ? 'Downloading...' : '📥 Download Logs CSV'}
            </Button>
          </div>

          {/* Inventory Export Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              📦 Export Inventory CSV
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={inventoryDateRange.startDate}
                  onChange={(e) => setInventoryDateRange({...inventoryDateRange, startDate: e.target.value})}
                  max={inventoryDateRange.endDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={inventoryDateRange.endDate}
                  onChange={(e) => setInventoryDateRange({...inventoryDateRange, endDate: e.target.value})}
                  min={inventoryDateRange.startDate}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <Button
              onClick={handleDownloadInventory}
              disabled={loadingInventory}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loadingInventory ? 'Downloading...' : '📥 Download Inventory CSV'}
            </Button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportReportsModal;
