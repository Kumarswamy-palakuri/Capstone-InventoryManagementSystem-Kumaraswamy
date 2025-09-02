import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import toast from 'react-hot-toast';

const UserMovements = () => {
  const user = useSelector(selectCurrentUser);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMovements = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem('token');
        let url = 'https://localhost:7273/api/Staff/movements'; // Staff: own movements only
        
        // Manager and Admin can see all movements
        if (user.role === 'Manager' || user.role === 'Admin') {
          url = 'https://localhost:7273/api/Staff/movements'; // All movements
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMovements(data);
      } catch (error) {
        console.error('Error fetching movements:', error);
        setError('Failed to load movement history');
        toast.error('Failed to load movements');
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, [user]);

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

  // Filter movements based on selected filter
  const filteredMovements = movements.filter(movement => {
    if (filter === 'all') return true;
    return movement.type === parseInt(filter);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading movements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Role-based Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.role === 'Staff' ? 'My Movement History' : 'All Movement History'}
          </h2>
          <p className="text-sm text-gray-600">
            Logged in as: <span className="font-medium">{user?.firstName} {user?.lastName}</span> 
            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
              user?.role === 'Admin' ? 'bg-red-100 text-red-800' :
              user?.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {user?.role}
            </span>
          </p>
        </div>
        
        {/* Movement Type Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="1">Stock In</option>
            <option value="2">Stock Out</option>
            <option value="3">Adjustment</option>
            <option value="4">Sale</option>
            <option value="5">Return</option>
            <option value="6">Damage</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Movements</div>
          <div className="text-2xl font-bold text-blue-900">{filteredMovements.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Stock In</div>
          <div className="text-2xl font-bold text-green-900">
            {filteredMovements.filter(m => m.type === 1).length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm text-red-600 font-medium">Stock Out</div>
          <div className="text-2xl font-bold text-red-900">
            {filteredMovements.filter(m => m.type === 2).length}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Sales</div>
          <div className="text-2xl font-bold text-purple-900">
            {filteredMovements.filter(m => m.type === 4).length}
          </div>
        </div>
      </div>

      {/* Movements Table */}
      {filteredMovements.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {filter === 'all' ? 'No movements found.' : `No ${getMovementTypeText(parseInt(filter))} movements found.`}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  {(user?.role === 'Manager' || user?.role === 'Admin') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous → New
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
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {movement.productName}
                    </td>
                    {(user?.role === 'Manager' || user?.role === 'Admin') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.userName}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
                        {getMovementTypeText(movement.type)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      movement.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.change > 0 ? '+' : ''}{movement.change}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.previousQuantity} → {movement.newQuantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {movement.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(movement.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs">{new Date(movement.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {movement.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMovements;
