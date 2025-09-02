import { useState, useEffect } from 'react';
import { useGetProductsQuery, useGetAdminLogsQuery, useGetAllUsersQuery } from '../../services/api';
import Card from '../../components/ui/Card';
import { 
  ChartBarIcon, 
  CubeIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const ManagerReports = () => {
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
  const { data: logs = [], isLoading: logsLoading, error: logsError } = useGetAdminLogsQuery();
  const { data: users = [], isLoading: usersLoading } = useGetAllUsersQuery();

  // Debug logs
  console.log('Logs data:', logs);
  console.log('Logs loading:', logsLoading);
  console.log('Logs error:', logsError);

  // Calculate analytics metrics
  const totalProducts = products.length;
  const totalUsers = users.length;
  const lowStockProducts = products.filter(p => p.isLowStock).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
  // Recent activity - limit to 10 most recent
  const recentLogs = logs.slice(0, 10);

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
  const getCategoryDistribution = () => {
    const categories = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  };

  const categoryDistribution = getCategoryDistribution();

  const getMovementTypeColor = (type) => {
    const colorMapping = {
      1: 'text-green-600 bg-green-100', // Stock In
      2: 'text-red-600 bg-red-100',     // Stock Out
      3: 'text-blue-600 bg-blue-100',   // Adjustment
      4: 'text-purple-600 bg-purple-100', // Sale
      5: 'text-yellow-600 bg-yellow-100', // Return
      6: 'text-red-600 bg-red-100'      // Damage
    };
    return colorMapping[type] || 'text-gray-600 bg-gray-100';
  };

  if (productsLoading || logsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (logsError) {
    console.error('Error loading logs:', logsError);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <CubeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Products</div>
              <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Movements</div>
              <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Low Stock Items</div>
              <div className="text-2xl font-bold text-gray-900">{lowStockProducts}</div>
            </div>
          </div>
        </Card>

        {/* <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Users</div>
              <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
            </div>
          </div>
        </Card> */}
      </div>
        <Card title="Products by Category">
          <div className="space-y-4">
            {categoryDistribution.length === 0 ? (
              <div className="text-center text-gray-500">No categories available</div>
            ) : (
              categoryDistribution.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">{category.name}</div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${totalProducts > 0 ? (category.count / totalProducts) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{category.count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
               <Card title="Quick Stats">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Movements</span>
              <span className="text-sm font-medium text-gray-900">{logs.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Product Value</span>
              <span className="text-sm font-medium text-gray-900">
                ${totalProducts > 0 ? (totalInventoryValue / totalProducts).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Low Stock %</span>
              <span className={`text-sm font-medium ${lowStockProducts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {totalProducts > 0 ? ((lowStockProducts / totalProducts) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </Card>
      {/* Recent Activity */}
      <Card title="Recent Inventory Activity">
        {recentLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
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
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(log.type)}`}>
                        {getMovementTypeText(log.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={log.change > 0 ? 'text-green-600' : 'text-red-600'}>
                        {log.change > 0 ? '+' : ''}{log.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.previousQuantity} → {log.newQuantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ManagerReports;
