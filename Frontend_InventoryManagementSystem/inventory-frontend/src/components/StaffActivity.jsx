import React, { useState, useEffect } from 'react';

const StaffActivity = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffMovements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7273/api/Staff/movements', {
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
        setError('Failed to fetch movement data');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMovements();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading activities...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (movements.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No recent activities to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">My Recent Activities</h3>
      <div className="space-y-3">
        {movements.slice(0, 10).map((movement) => (
          <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {movement.productName}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
                  {getMovementTypeText(movement.type)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {movement.reason}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                movement.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {movement.change > 0 ? '+' : ''}{movement.change}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(movement.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffActivity;
