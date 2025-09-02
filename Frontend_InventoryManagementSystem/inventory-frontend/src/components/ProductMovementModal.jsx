import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Card from './ui/Card';

const ProductMovementModal = ({ isOpen, onClose, productId, productName }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch movements for specific product
  const fetchProductMovements = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7273/api/Staff/movements/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movements');
      }

      const data = await response.json();
      setMovements(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching movements:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch movements when modal opens
  React.useEffect(() => {
    if (isOpen && productId) {
      fetchProductMovements(productId);
    }
  }, [isOpen, productId]);

  // Movement type mapping
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Movement Logs - {productName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {!loading && !error && movements.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No movements found for this product</p>
          </div>
        )}

        {!loading && !error && movements.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
                        {getMovementTypeText(movement.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={movement.change > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {movement.change > 0 ? '+' : ''}{movement.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.previousQuantity} → {movement.newQuantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {movement.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(movement.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(movement.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {movement.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductMovementModal;
